import { Request, Response } from "express";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { statusRes } from "../interfaces";
import { Users } from "../schemas/userSchema";
import { Tokens } from "../schemas/tokenSchema";
import { Groups } from "../schemas/groupSchema";
import jwtVerfiyCatch from "../helpers/jwtVerfiyCatch";

export default async function newgroup(req: Request, _res: Response) {
    let status = {} as statusRes;
    const { groupname, description, isPublic , players } = req.body;
    const accessToken = req.body.token;

    const DBToken = await Tokens.findOne({ token: accessToken });
    if (!DBToken) {
        await logging('Access-Token not found in DB!', ['warn'], req);
        status.code = 401;
        return status;
    }
    if (DBToken.used) {
        await logging('DBToken was already used!', ['debug'], req);
        status.code = 401;
        return status;
    }

    let accessTokenData: string | jwt.JwtPayload = {};
    try {
        accessTokenData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);            
    } catch (err: any) {
        await jwtVerfiyCatch('accessToken', accessToken, err, false, status, req);
        return status;
    }
    if (typeof accessTokenData === 'string') {
        await logging('accessTokenData was a string. Token: ' + accessToken, ['error'], req);
        status.code = 401;
        return status;
    }

    DBToken.used = true;
    DBToken.save();

    const user = await Users.findOne({ uuid: accessTokenData.user });
    if (!user) {
        await logging('User of Access-Token not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }

    const group = await Groups.create({ data: { uuid: uuidv4(), name: groupname, description, isPublic , players, owner: user._id } });

    user.data.groups.push(group._id);
    user.updatedAt = Date.now();
    user.save();

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 201;
    await logging('Group created: ' + group._id + ' with Access-Token: ' + DBToken._id, ['debug','info.cyan'], req);
    return status;
}