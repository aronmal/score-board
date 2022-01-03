import {Request, Response} from "express";
import {Tokens, Users} from "./schemas";
import bcrypt from "bcrypt";
import {errorRes, getLog, postLog} from "./logging";
import {findUserById, findUserByName, findUserByUuid} from "./helpers";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;
        const user = await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) });
        res.status(201)
        postLog('Request served' + ' [INFO] User created : '.cyan + JSON.stringify(user));
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
    
        const user = await findUserByName(username, res)
        if (user === undefined)
            return;
    
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401);
            return;
        }
    
        const refreshToken: string = jwt.sign( { user: user.uuid } , process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: 172800 });
    
        const DBRefreshToken = await Tokens.create({ token: refreshToken, owner: user._id });
        if (!DBRefreshToken)
            return;
    
        res.status(200).cookie('token', refreshToken, {
            domain: 'localhost',
            httpOnly: true,
            // secure: true,
            // path: '/api/auth,'
        }).json(await Users.findOne({ username: user.username }).select('-_id -__v -password -createdAt -updatedAt'));
        console.log('[Debug] '.grey + '[INFO] User '.cyan + user._id + ' logged in and generated Refresh-Token: '.cyan + DBRefreshToken._id)
        getLog('Request served');
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function auth(req: Request, res: Response) {
    try {
        const cookieRefreshToken: string = req.cookies.token

        const validToken = await Tokens.exists({ token: cookieRefreshToken });
        const refreshTokenData = jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { user: string };
        
        if (!validToken || !refreshTokenData)
            return;

        const user = await findUserByUuid(refreshTokenData.user, res)
        if (user === undefined)
            return;

        const accessToken: string = jwt.sign( { user: user._id } , process.env.ACCESS_TOKEN_SECRET as string)
        res.status(200).json({ token: accessToken });
        getLog('Served access token.')
    } catch (err: any) {
        errorRes(err.message, res);
    }
}
