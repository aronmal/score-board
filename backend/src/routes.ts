import { Request, Response } from "express";
import { Tokens, Users, Groups, statusRes } from "./schemas";
import bcrypt from "bcrypt";
import { logging } from "./logging";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { jwtVerfiyCatch } from "./helpers";

export async function register(req: Request, _res: Response) {
    let status = {} as statusRes;
    const { username, email, password } = req.body;
    let user
    try {
        user = await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) });
    } catch (err: any) {
        if (err.code === 11000) {
            await logging(`Duplicate key error while creating User in DB!`, ['warn'], req);
            status.code = 409;
        } else {
            await logging(`Unknown error while creating User in DB.`, ['error'], req);
            status.code = 500;
        }
        return status;
    }

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 201;
    await logging('User created : ' + user._id, ['debug','info.cyan'], req);
    return status;
}

export async function login(req: Request, res: Response) {
    let status = {} as statusRes;
    const oldRefreshToken: string = req.cookies.token
    const { username, password } = req.body;

    const oldDBToken = await Tokens.findOne({ token: oldRefreshToken });
    if (oldDBToken && !oldDBToken.used) {
        oldDBToken.used = true;
        oldDBToken.save();
        await logging('Old token has been invalidated.', ['debug'], req)
    }

    const userByName = await Users.findOne({ username: username });
    const userByEmail = await Users.findOne({ email: username });
    if (!userByName && !userByEmail) {
        await logging('User not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }
    const user = userByName || userByEmail;

    if (!await bcrypt.compare(password, user.password)) {
        status.code = 401;
        return status;
    }

    const refreshToken = jwt.sign( { user: user.uuid } , process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: 172800 });

    const createdDBToken = await Tokens.create({ token: refreshToken, owner: user._id, expiresIn: Date.now() + 172800000 });

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 200;
    res.cookie(
        'token', refreshToken,
        {
            maxAge: 172800000,
            httpOnly: true,
            path: '/api',
            sameSite: true,
            secure: true,
        }
    );
    await logging('User ' + user._id + ' logged in and generated Refresh-Token: ' + createdDBToken._id, ['debug','info.cyan'], req)
    return status;
}

export async function logout(req: Request, res: Response) {
    let status = {} as statusRes;
    const oldRefreshToken: string = req.cookies.token
    if (!oldRefreshToken) {
        await logging('No Access-Token cookie present!', ['error'], req);
        status.code = 200;
        return status;
    }

    const oldDBToken = await Tokens.findOne({ token: oldRefreshToken });
    if (!oldDBToken) {
        await logging('Old Access-Token not found in DB!', ['warn'], req);
        status.code = 200;
        return status;
    }
    if (!oldDBToken.used) {
        oldDBToken.used = true;
        oldDBToken.save();
        await logging('Old token has been invalidated.', ['debug'], req)
    }

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 200;
    res.clearCookie;
    await logging('User of Token ' + oldDBToken._id + ' logged out.', ['debug','info.cyan'], req)
    return status;
}

export async function auth(req: Request, _res: Response) {
    let status = {} as statusRes;
    const refreshToken: string = req.cookies.token

    let refreshTokenData: string | jwt.JwtPayload = {};
    try {
        refreshTokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);            
    } catch (err: any) {
        await jwtVerfiyCatch('refreshToken', refreshToken, err, status, req);
        return status;
    }
    if (typeof refreshTokenData === 'string') {
        await logging('Refresh-Token was a string. Token: ' + refreshToken, ['error'], req);
        status.code = 401;
        return status;
    }

    const DBToken = await Tokens.findOne({ token: refreshToken });
    if (!DBToken) {
        await logging('Refresh-Token not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }
    if (DBToken.used) {
        await logging('DBToken was already used!', ['warn'], req);
        status.code = 401;
        return status;
    }
    
    const user = await Users.findOne({ uuid: refreshTokenData.user });
    if (!user) {
        await logging('User of Refresh-Token not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }

    const accessToken = jwt.sign( { user: user.uuid } , process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 15 });

    const createdDBToken = await Tokens.create({ token: accessToken, owner: user._id, expiresIn: Date.now() + 15000 });

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 200;
    status.body = { token: accessToken };
    await logging('Access-Token generated: ' + createdDBToken._id + ' with Refreshtoken-Token: ' + DBToken._id, ['debug','info.cyan'], req);
    return status;
}

export async function newgroup(req: Request, _res: Response) {
    let status = {} as statusRes;
    const { groupname, description, isPublic , players } = req.body;
    const accessToken = req.body.token;

    const DBToken = await Tokens.findOne({ token: accessToken });
    if (!DBToken) {
        await logging('Access-Token not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }
    if (DBToken.used) {
        await logging('DBToken was already used!', ['warn'], req);
        status.code = 401;
        return status;
    }

    let accessTokenData: string | jwt.JwtPayload = {};
    try {
        accessTokenData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);            
    } catch (err: any) {
        await jwtVerfiyCatch('accessToken', accessToken, err, status, req);
        return status;
    }
    if (typeof accessTokenData === 'string') {
        await logging('accessTokenData was a string. Token: ' + accessToken, ['error'], req);
        status.code = 401;
        return status;
    }

    DBToken.used = true;
    DBToken.save();

    const user = await Users.findOne({ uuid: accessTokenData.user });
    if (!user) {
        await logging('User of Access-Token not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }

    const group = await Groups.create({ uuid: uuidv4(), name: groupname, description, isPublic , players, owner: user._id });

    user.groups.push(group._id);
    user.updatedAt = Date.now();
    user.save();

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 201;
    await logging('Group created: ' + group._id + ' with Access-Token: ' + DBToken._id, ['debug','info.cyan'], req);
    return status;
}