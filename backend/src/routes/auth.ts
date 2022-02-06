import { Request, Response } from "express";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import { userType } from "../interfaces";
import { Users } from "../schemas/userSchema";
import { Tokens } from "../schemas/tokenSchema";
import jwtVerfiyCatch from "../helpers/jwtVerfiyCatch";

export default async function auth(req: Request, res: Response) {
    const refreshToken: string = req.cookies.token
    const loginCheck = (req.body.type === 'loginCheck')

    let refreshTokenData: string | jwt.JwtPayload = {};
    try {
        refreshTokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);            
    } catch (err: any) {
        if (loginCheck) {
            res.status(200).json({ loggedIn: false });
            await logging('loginCheck -> loggedIn: ' + false, ['debug','info.cyan'], req)
            return;
        }
        await jwtVerfiyCatch('refreshToken', refreshToken, err, req, res);
        return;
    }
    if (typeof refreshTokenData === 'string') {
        await logging('Refresh-Token was a string. Token: ' + refreshToken, ['error'], req);
        res.status(401);
        return;
    }

    const DBToken = await Tokens.findOne({ token: refreshToken });
    if (!DBToken) {
        await logging('Refresh-Token not found in DB!', ['warn'], req);
        res.status(401);
        return;
    }
    if (DBToken.used) {
        res.clearCookie('token');
        await logging('DBToken was already used!', ['debug'], req);
        res.status(401);
        return;
    }
    
    const user: userType = await Users.findOne({ uuid: refreshTokenData.user });
    if (!user) {
        await logging('User of Refresh-Token not found in DB!', ['error'], req);
        res.status(401);
        return;
    }

    if (loginCheck) {
        res.json({ loggedIn: true });
        await logging('loginCheck ' + loginCheck + ' of ' + DBToken._id, ['debug','info.cyan'], req)
        return;
    }

    const accessToken = jwt.sign( { user: user.uuid } , process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 15 });

    const createdDBToken = await Tokens.create({ token: accessToken, type: 'access', owner: user._id, expiresIn: Date.now() + 15000 });

    if (res.statusCode !== 200) {
        await logging('Early exit: ' + res.statusCode, ['warn'], req);
        return;
    }
    res.status(200).json({ token: accessToken });
    await logging('Access-Token generated: ' + createdDBToken._id + ' with Refreshtoken-Token: ' + DBToken._id, ['debug','info.cyan'], req);
}