import { Request, Response } from "express";
import { logging } from "../logging";
import { statusRes } from "../interfaces";
import { Tokens } from "../schemas/tokenSchema";

export default async function logout(req: Request, res: Response) {
    let status = {} as statusRes;
    const oldRefreshToken: string = req.cookies.token
    if (!oldRefreshToken) {
        await logging('No Access-Token cookie present!', ['warn'], req);
        status.code = 200;
        return status;
    }

    const oldDBToken = await Tokens.findOne({ token: oldRefreshToken });
    if (!oldDBToken) {
        await logging('Old Access-Token not found in DB!', ['warn'], req);
        status.code = 200;
        return status;
    }
    if (!oldDBToken.used) {
        oldDBToken.used = true;
        oldDBToken.save();
        await logging('Old token has been invalidated.', ['debug'], req)
    }

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 200;
    res.clearCookie('token');
    await logging('User of Token ' + oldDBToken._id + ' logged out.', ['debug','info.cyan'], req)
    return status;
}