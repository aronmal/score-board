import { Request, Response } from "express";
import { Tokens, Users, Groups } from "./schemas";
import bcrypt from "bcrypt";
import { debugLog, errorLog, errorRes, postLog } from "./logging";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { jwtVerfiyCatch } from "./helpers";

export async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;
        const user = await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) });
        res.sendStatus(201);
        debugLog('[INFO] User created : '.cyan + user._id);
        postLog('Request served');
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
    
        const user = await Users.findOne({ username: username });
        if (!user) {
            errorLog('User not found in DB!');
            res.sendStatus(401);
            return;
        }
    
        if (!await bcrypt.compare(password, user.password)) {
            res.sendStatus(401);
            return;
        }
    
        const refreshToken = jwt.sign( { user: user.uuid } , process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: 172800 });

        const createdDBToken = await Tokens.create({ token: refreshToken, owner: user._id, expiresIn: Date.now() + 172800000 });
    
        res.status(200).cookie(
            'token', refreshToken,
            {
                domain: 'localhost',
                httpOnly: true,
                // secure: true,
                path: '/api',
            }
        );
        debugLog('[INFO] User '.cyan + user._id + ' logged in and generated Refresh-Token: '.cyan + createdDBToken._id)
        postLog('Request served');
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function auth(req: Request, res: Response) {
    const refreshToken: string = req.cookies.token

    let refreshTokenData: string | jwt.JwtPayload = {};
    try {
        refreshTokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);            
    } catch (err: any) {
        jwtVerfiyCatch('refreshToken', refreshToken, err, res) 
    }
    if (typeof refreshTokenData === 'string') {
        errorLog('cookieRefreshToken was a string. Token: ' + refreshToken);
        res.sendStatus(401);
        return;
    }

    const DBToken = await Tokens.findOne({ token: refreshToken });
    if (!DBToken) {
        errorLog('Token not found in DB!');
        res.sendStatus(401);
        return;
    }
    if (DBToken.used) {
        errorLog('DBToken was alerady used!');
        res.sendStatus(401);
        return;
    }
    
    const user = await Users.findOne({ uuid: refreshTokenData.user });
    if (!user) {
        errorLog('User of Token not found in DB!');
        res.sendStatus(401);
        return;
    }

    const accessToken = jwt.sign( { user: user.uuid } , process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 15 });

    const createdDBToken = await Tokens.create({ token: accessToken, owner: user._id, expiresIn: Date.now() + 15000 });
    
    res.status(200).json({ token: accessToken });
    debugLog('[INFO] Access-Token generated: '.cyan + createdDBToken._id + ' with Refreshtoken-Token: '.cyan + DBToken._id);
    postLog('Request served');
}

export async function newgroup(req: Request, res: Response) {
    const { groupname, description, ispublic , players } = req.body;
    const accessToken = req.body.token;

    const DBToken = await Tokens.findOne({ token: accessToken });
    if (!DBToken) {
        errorLog('Token not found in DB!');
        res.sendStatus(401);
        return;
    }
    if (DBToken.used) {
        errorLog('DBToken was alerady used!');
        res.sendStatus(401);
        return;
    }

    let accessTokenData: string | jwt.JwtPayload = {};
    try {
        accessTokenData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);            
    } catch (err: any) {
        jwtVerfiyCatch('accessToken', accessToken, err, res) 
    }
    if (typeof accessTokenData === 'string') {
        errorLog('accessTokenData was a string. Token: ' + accessToken);
        res.sendStatus(401);
        return;
    }

    DBToken.used = true;
    DBToken.save();

    const user = await Users.findOne({ uuid: accessTokenData.user });
    if (!user) {
        errorLog('User of Token not found in DB!');
        res.sendStatus(401);
        return;
    }

    const group = await Groups.create({ name: groupname, description: description, isPublic: ispublic , players: players, owner: user._id });

    user.groups.push(group._id);
    user.updatedAt = Date.now();
    user.save();

    res.sendStatus(200);
    debugLog('[INFO] Group created: '.cyan + group._id + ' with Access-Token: '.cyan + DBToken._id);
    postLog('Request served');
}