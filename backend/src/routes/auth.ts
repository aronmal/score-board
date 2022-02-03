import { Request, Response } from "express";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import { statusRes } from "../interfaces";
import Users from "../schemas/userSchema";
import Tokens from "../schemas/tokenSchema";
import jwtVerfiyCatch from "../helpers/jwtVerfiyCatch";

export default async function auth(req: Request, res: Response) {
    let status = {} as statusRes;
    const refreshToken: string = req.cookies.token
    const loginCheck = (req.body.type === 'loginCheck')

    let refreshTokenData: string | jwt.JwtPayload = {};
    try {
        refreshTokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);            
    } catch (err: any) {
        await jwtVerfiyCatch('refreshToken', refreshToken, err, loginCheck, status, req);
        return status;
    }
    if (typeof refreshTokenData === 'string') {
        await logging('Refresh-Token was a string. Token: ' + refreshToken, ['error'], req);
        status.code = 401;
        return status;
    }

    const DBToken = await Tokens.findOne({ token: refreshToken });
    if (!DBToken) {
        await logging('Refresh-Token not found in DB!', ['warn'], req);
        status.code = 401;
        return status;
    }
    if (DBToken.used) {
        res.clearCookie('token');
        await logging('DBToken was already used!', ['debug'], req);
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

    const createdDBToken = await Tokens.create({ token: accessToken, type: 'access', owner: user._id, expiresIn: Date.now() + 15000 });

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 200;
    if (!loginCheck) {
        status.body = { token: accessToken };
        await logging('Access-Token generated: ' + createdDBToken._id + ' with Refreshtoken-Token: ' + DBToken._id, ['debug','info.cyan'], req);
    } else {
        status.body = { loggedIn: true };
        await logging('loginCheck ' + loginCheck + ' of ' + DBToken._id, ['debug','info.cyan'], req)
    }
    return status;
}