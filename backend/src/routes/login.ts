import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import { statusRes } from "../interfaces";
import { Users } from "../schemas/userSchema";
import { Tokens } from "../schemas/tokenSchema";

export default async function login(req: Request, res: Response) {
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
        await logging('User not found in DB!', ['debug'], req);
        status.code = 401;
        return status;
    }
    const user = userByName || userByEmail;

    if (!await bcrypt.compare(password, user.password)) {
        status.code = 401;
        return status;
    }

    const refreshToken = jwt.sign( { user: user.data.uuid } , process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: 172800 });

    const createdDBToken = await Tokens.create({ token: refreshToken, type: 'refresh', owner: user._id, expiresIn: Date.now() + 172800000 });

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
            sameSite: true,
            secure: true,
        }
    );
    await logging('User ' + user._id + ' logged in and generated Refresh-Token: ' + createdDBToken._id, ['debug','info.cyan'], req)
    return status;
}