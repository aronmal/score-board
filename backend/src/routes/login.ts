import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import Users from "../schemas/userSchema";
import Tokens from "../schemas/tokenSchema";

export default async function login(req: Request, res: Response) {
    const oldRefreshToken = req.cookies.token
    const { username, password } = req.body;

    const oldDBToken = await Tokens.findOne({ token: oldRefreshToken });
    if (oldDBToken && !oldDBToken.used) {
        oldDBToken.used = true;
        oldDBToken.save();
        await logging('Old token has been invalidated.', ['debug'], req)
    }

    const userByName = await Users.findOne({ username });
    const userByEmail = await Users.findOne({ email: username });
    const user = userByName || userByEmail;
    if (!user) {
        await logging('User not found in DB!', ['debug'], req);
        res.status(401);
        return;
    }

    if (!await bcrypt.compare(password, user.passwordHash)) {
        res.status(401);
        await logging('Passwords do not match!', ['debug'], req);
        return;
    }

    const refreshToken = jwt.sign( { user: user.uuid } , process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: 172800 });

    const createdDBToken = await Tokens.create({ token: refreshToken, type: 'refresh', owner: user._id, expiresIn: Date.now() + 172800000 });

    if (res.statusCode !== 200) {
        await logging('Early exit: ' + res.statusCode, ['warn'], req);
        return;
    }
    res.status(200).cookie(
        'token', refreshToken,
        {
            maxAge: 172800000,
            httpOnly: true,
            sameSite: true,
            secure: true,
        }
    );
    await logging('User ' + user._id + ' logged in and generated Refresh-Token: ' + createdDBToken._id, ['debug','info.cyan'], req)
}