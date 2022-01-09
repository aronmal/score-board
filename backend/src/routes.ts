import { Request, Response } from "express";
import { Tokens, Users, Groups, statusRes } from "./schemas";
import bcrypt from "bcrypt";
import { debugLog, warnLog, errorLog } from "./logging";
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
            warnLog(`Duplicate key error while creating User in DB!`);
            status.code = 409;
        } else {
            errorLog(`Unknown error while creating User in DB.`);
            status.code = 500;
        }
        return status;
    }

    if (status.code !== undefined) {
        errorLog('Early exit: ' + JSON.stringify(status));
        return status;
    }
    status.code = 201;
    debugLog('[INFO] User created : '.cyan + user._id);
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
        debugLog('Old token has been invalidated.')
    }

    const userByName = await Users.findOne({ username: username });
    const userByEmail = await Users.findOne({ email: username });
    if (!userByName && !userByEmail) {
        errorLog('User not found in DB!');
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
        errorLog('Early exit: ' + JSON.stringify(status));
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
    debugLog('[INFO] User '.cyan + user._id + ' logged in and generated Refresh-Token: '.cyan + createdDBToken._id)
    return status;
}

export async function logout(req: Request, res: Response) {
    let status = {} as statusRes;
    const oldRefreshToken: string = req.cookies.token

    const oldDBToken = await Tokens.findOne({ token: oldRefreshToken });
    if (!oldDBToken) {
        warnLog('Old Access-Token not found in DB!');
    }
    if (!oldDBToken.used) {
        oldDBToken.used = true;
        oldDBToken.save();
        debugLog('Old token has been invalidated.')
    }

    if (status.code !== undefined) {
        errorLog('Early exit: ' + JSON.stringify(status));
        return status;
    }
    status.code = 200;
    res.clearCookie;
    debugLog('[INFO] User of Token '.cyan + oldDBToken._id + ' logged out.'.cyan )
    return status;
}

export async function auth(req: Request, _res: Response) {
    let status = {} as statusRes;
    const refreshToken: string = req.cookies.token

    let refreshTokenData: string | jwt.JwtPayload = {};
    try {
        refreshTokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);            
    } catch (err: any) {
        jwtVerfiyCatch('refreshToken', refreshToken, err, status);
        return status;
    }
    if (typeof refreshTokenData === 'string') {
        errorLog('Refresh-Token was a string. Token: ' + refreshToken);
        status.code = 401;
        return status;
    }

    const DBToken = await Tokens.findOne({ token: refreshToken });
    if (!DBToken) {
        errorLog('Refresh-Token not found in DB!');
        status.code = 401;
        return status;
    }
    if (DBToken.used) {
        errorLog('DBToken was alerady used!');
        status.code = 401;
        return status;
    }
    
    const user = await Users.findOne({ uuid: refreshTokenData.user });
    if (!user) {
        errorLog('User of Refresh-Token not found in DB!');
        status.code = 401;
        return status;
    }

    const accessToken = jwt.sign( { user: user.uuid } , process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 15 });

    const createdDBToken = await Tokens.create({ token: accessToken, owner: user._id, expiresIn: Date.now() + 15000 });

    if (status.code !== undefined) {
        errorLog('Early exit: ' + JSON.stringify(status));
        return status;
    }
    status.code = 200;
    status.body = { token: accessToken };
    debugLog('[INFO] Access-Token generated: '.cyan + createdDBToken._id + ' with Refreshtoken-Token: '.cyan + DBToken._id);
    return status;
}

export async function newgroup(req: Request, _res: Response) {
    let status = {} as statusRes;
    const { groupname, description, isPublic , players } = req.body;
    const accessToken = req.body.token;

    const DBToken = await Tokens.findOne({ token: accessToken });
    if (!DBToken) {
        errorLog('Access-Token not found in DB!');
        status.code = 401;
        return status;
    }
    if (DBToken.used) {
        errorLog('DBToken was alerady used!');
        status.code = 401;
        return status;
    }

    let accessTokenData: string | jwt.JwtPayload = {};
    try {
        accessTokenData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);            
    } catch (err: any) {
        jwtVerfiyCatch('accessToken', accessToken, err, status);
        return status;
    }
    if (typeof accessTokenData === 'string') {
        errorLog('accessTokenData was a string. Token: ' + accessToken);
        status.code = 401;
        return status;
    }

    DBToken.used = true;
    DBToken.save();

    const user = await Users.findOne({ uuid: accessTokenData.user });
    if (!user) {
        errorLog('User of Access-Token not found in DB!');
        status.code = 401;
        return status;
    }

    const group = await Groups.create({ name: groupname, description, isPublic , players, owner: user._id });

    user.groups.push(group._id);
    user.updatedAt = Date.now();
    user.save();

    if (status.code !== undefined) {
        errorLog('Early exit: ' + JSON.stringify(status));
        return status;
    }
    status.code = 200;
    debugLog('[INFO] Group created: '.cyan + group._id + ' with Access-Token: '.cyan + DBToken._id);
    return status;
}