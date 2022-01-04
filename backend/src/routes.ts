import {Request, Response} from "express";
import {Tokens, Users, userType, Groups} from "./schemas";
import bcrypt from "bcrypt";
import {errorLog, errorRes, getLog, postLog} from "./logging";
import {findUserById, findUserByName, findUserByUuid} from "./helpers";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;
        const user = (await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) })) as userType;
        res.status(201)
        postLog('Request served' + ' [INFO] User created : '.cyan + user._id);
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
    
        const user = await Users.findOne({ username: username })
    
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401);
            return;
        }
    
        const refreshToken: string = jwt.sign( { user: user.uuid } , process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: 172800 });

        await Tokens.create({ token: refreshToken, owner: user._id, expiresIn: Date.now() + 172800000 });
    
        res.status(200).cookie(
            'token', refreshToken,
            {
                domain: 'localhost',
                httpOnly: true,
                // secure: true,
                path: '/api',
            }
        ).json(await Users.findOne({ username: user.username }).select('-_id -__v -password -createdAt -updatedAt'));
        console.log('[Debug] '.grey + '[INFO] User '.cyan + user._id + ' logged in and generated Refresh-Token: '.cyan + refreshToken)
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
            throw new Error('Refresh-Token is not valid!');
      
        const user = await Users.findOne({ uuid: refreshTokenData.user });

        const accessToken: string = jwt.sign( { user: user.uuid } , process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 15 });

        await Tokens.create({ token: accessToken, owner: user._id, expiresIn: Date.now() + 15000 });

        res.status(200).json({ token: accessToken });
        getLog('Served access token.')
    } catch (err: any) {
        errorRes(err.message, res);
    }
}

export async function newgroup(req: Request, res: Response) {
    try {
        const { token, groupname, description, ispublic , players } = req.body;
        

        const DBToken = await Tokens.findOne({ token: token });
        // TODO don't double Error
        if (DBToken === null) {
            errorLog('Token not found in DB!')
            res.sendStatus(401)
        }
        if (!DBToken)
            throw new Error('Access-Token not found in DB!');

        const tokenUsed = DBToken.used
        if (tokenUsed)
            throw new Error('Access-Token was already used!');

        const accessTokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        if (!accessTokenData)
            throw new Error('Access-Token has no valid data!');
        if (typeof accessTokenData === 'string')
            throw new Error('Bad Token!')

        DBToken.used = true
        DBToken.save()

        const user = await Users.findOne({ uuid: accessTokenData.user });
        if (user === null) {
            errorLog('User of Token not found in DB!')
            res.sendStatus(403)
            return
        }
        const group = await Groups.create({ name: groupname, description: description, isPublic: ispublic , players: players, owner: user._id });

        user.groups.push(group._id)
        user.updatedAt = Date.now()
        user.save()

        res.status(200)
        console.log('[Debug] '.grey + '[INFO] Group created: '.cyan + group._id + ' with Access-Token: '.cyan + DBToken._id)
        getLog('Request served');
    } catch (err: any) {
        if (err.message === 'jwt expired') {
            console.log('[WARN] '.yellow + 'jwt expired!')
            res.status(401)
            return
        }
        if (err.message === 'invalid signature') {
            console.log('[WARN] '.yellow + 'invalid JWT signature!')
            res.status(403)
            return
        }
        errorRes(err.message, res);
    }
}