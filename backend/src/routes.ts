import {Request, Response} from "express";
import {Tokens, Users, userType, Groups} from "./schemas";
import bcrypt from "bcrypt";
import {errorLog, errorRes, getLog, postLog} from "./logging";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;
        const user = (await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) })) as userType;
        res.sendStatus(201)
        postLog('Request served' + ' [INFO] User created : '.cyan + user._id);
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

        await Tokens.create({ token: refreshToken, owner: user._id, expiresIn: Date.now() + 172800000 });
    
        res.status(200).cookie(
            'token', refreshToken,
            {
                domain: 'localhost',
                httpOnly: true,
                // secure: true,
                path: '/api',
            }
        );
        console.log('[Debug] '.grey + '[INFO] User '.cyan + user._id + ' logged in and generated Refresh-Token: '.cyan + refreshToken)
        getLog('Request served');
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function auth(req: Request, res: Response) {
    const cookieRefreshToken: string = req.cookies.token

    let refreshTokenData: string | jwt.JwtPayload = {};
    try {
        refreshTokenData = jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);            
    } catch (err: any) {
        if (err.message === 'jwt expired') {
            console.log('[DEBUG] '.grey + 'JWT (cookieRefreshToken) expired!');
            res.sendStatus(403);
            return;
        }
        if (err.message === 'invalid signature') {
            errorLog('Invalid JWT (cookieRefreshToken) signature! Token: ' + cookieRefreshToken);
            res.sendStatus(401);
            return;
        }
        if (err.message === 'jwt must be provided') {
            errorLog('No JWT (cookieRefreshToken) given.');
            res.sendStatus(401);
            return;
        }
        errorRes(err.message, res);
    }
    if (typeof refreshTokenData === 'string') {
        errorLog('cookieRefreshToken was a string. Token: ' + cookieRefreshToken);
        res.sendStatus(401);
        return;
    }

    const DBToken = await Tokens.findOne({ token: cookieRefreshToken });
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

    await Tokens.create({ token: accessToken, owner: user._id, expiresIn: Date.now() + 15000 });
    
    res.status(200).json({ token: accessToken });
    getLog('Served Access-Token.');
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
        if (err.message === 'jwt expired') {
            console.log('[WARN] '.yellow + 'JWT (accessToken) expired!');
            res.sendStatus(403);
            return;
        }
        if (err.message === 'invalid signature') {
            errorLog('Invalid JWT (accessToken) signature! Token: ' + accessToken);
            res.sendStatus(401);
            return;
        }
        if (err.message === 'jwt must be provided') {
            errorLog('No JWT (accessToken) given.');
            res.sendStatus(401);
            return;
        }
        errorRes(err.message, res);
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
    console.log('[Debug] '.grey + '[INFO] Group created: '.cyan + group._id + ' with Access-Token: '.cyan + DBToken._id);
    getLog('Request served');
}