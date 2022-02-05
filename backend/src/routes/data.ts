import { Request, Response } from "express";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import { statusRes, groupType } from "../interfaces";
import Users from "../schemas/userSchema";
import Tokens from "../schemas/tokenSchema";
import jwtVerfiyCatch from "../helpers/jwtVerfiyCatch";
import isGroup from "../helpers/isGroup";

export default async function data(req: Request, _res: Response) {
    let status = {} as statusRes;
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

    const user = await Users.findOne({ uuid: accessTokenData.user }).select('-passwordHash -createdAt -updatedAt -__v').populate({ path: 'groups', select: '-_id -createdAt -updatedAt -__v' });
    if (!user) {
        await logging('User of Access-Token not found in DB!', ['error'], req);
        status.code = 401;
        return status;
    }

    const groups: {
        uuid: string,
        name: string,
        doTeams: boolean,
        playerCount: number,
        teamCount: number
    }[] = []
    user.groups.forEach(async e => {
        if (isGroup(e) && (user._id.toString() === e.owner.toString()))
        groups.push({ uuid: e.uuid, name: e.name, doTeams: e.doTeams, playerCount: e.players.length, teamCount: e.teams.length })
    })
    const userData = {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        groups,
    }
    
    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 200;
    status.body = { data: userData };
    await logging('Requested data of user: ' + user._id + ' with Access-Token: ' + DBToken._id, ['debug','info.cyan'], req);
    return status;
}