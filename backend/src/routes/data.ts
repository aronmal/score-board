import { Request, Response } from "express";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import Users from "../schemas/userSchema";
import Tokens from "../schemas/tokenSchema";
import jwtVerfiyCatch from "../helpers/jwtVerfiyCatch";
import isGroup from "../helpers/isGroup";

export default async function data(req: Request, res: Response) {
    const accessToken = req.body.token;

    const DBToken = await Tokens.findOne({ token: accessToken });
    if (!DBToken) {
        await logging('Access-Token not found in DB!', ['warn'], req);
        res.status(401);
        return;
    }
    if (DBToken.used) {
        await logging('DBToken was already used!', ['debug'], req);
        res.status(401);
        return;
    }

    let accessTokenData: string | jwt.JwtPayload = {};
    try {
        accessTokenData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);            
    } catch (err: any) {
        await jwtVerfiyCatch('accessToken', accessToken, err, req, res);
        return;
    }
    if (typeof accessTokenData === 'string') {
        await logging('accessTokenData was a string. Token: ' + accessToken, ['error'], req);
        res.status(401);
        return;
    }

    DBToken.used = true;
    DBToken.save();

    const user = await Users.findOne({ uuid: accessTokenData.user }).select('-passwordHash -createdAt -updatedAt -__v').populate({ path: 'groups', select: '-_id -createdAt -updatedAt -__v' });
    if (!user) {
        await logging('User of Access-Token not found in DB!', ['error'], req);
        res.status(401);
        return;
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

    if (res.statusCode !== 200) {
        await logging('Early exit: ' + res.statusCode, ['warn'], req);
        return;
    }
    res.status(200).json({ data: userData });
    await logging('Requested data of user: ' + user._id + ' with Access-Token: ' + DBToken._id, ['debug','info.cyan'], req);
}