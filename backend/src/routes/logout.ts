import { Request, Response } from "express";
import { logging } from "../logging";
import { Tokens } from "../schemas/tokenSchema";

export default async function logout(req: Request, res: Response) {
    const oldRefreshToken: string = req.cookies.token
    if (!oldRefreshToken) {
        await logging('No Access-Token cookie present!', ['warn'], req);
        res.status(200);
        return;
    }

    const oldDBToken = await Tokens.findOne({ token: oldRefreshToken });
    if (!oldDBToken) {
        await logging('Old Access-Token not found in DB!', ['warn'], req);
        res.status(200);
        return;
    }
    if (!oldDBToken.used) {
        oldDBToken.used = true;
        oldDBToken.save();
        await logging('Old token has been invalidated.', ['debug'], req)
    }

    if (res.statusCode !== 200) {
        await logging('Early exit: ' + res.statusCode, ['warn'], req);
        return;
    }
    res.status(200);
    res.clearCookie('token');
    await logging('User of Token ' + oldDBToken._id + ' logged out.', ['debug','info.cyan'], req)
    return;
}