import { Request, Response } from "express";
import { logging } from "../logging";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { userType } from "../interfaces";
import { Users } from "../schemas/userSchema";
import { Tokens } from "../schemas/tokenSchema";
import { Groups } from "../schemas/groupSchema";
import jwtVerfiyCatch from "../helpers/jwtVerfiyCatch";

export default async function newgroup(req: Request, res: Response) {
    const { groupname, description, isPublic, doTeams, players, teams } = req.body;
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

    const user: userType = await Users.findOne({ uuid: accessTokenData.user });
    if (!user) {
        await logging('User of Access-Token not found in DB!', ['error'], req);
        res.status(401);
        return;
    }

    const group = await Groups.create({ uuid: uuidv4(), name: groupname, description, isPublic, doTeams, players, teams, owner: user._id });

    user.groups.push(group._id);
    user.updatedAt = Date.now();
    user.save();

    if (res.statusCode !== 200) {
        await logging('Early exit: ' + res.statusCode, ['warn'], req);
        return;
    }
    res.status(201)
    await logging('Group created: ' + group._id + ' with Access-Token: ' + DBToken._id, ['debug','info.cyan'], req);
}