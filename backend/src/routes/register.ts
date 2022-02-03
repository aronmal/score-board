import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { logging } from "../logging";
import { v4 as uuidv4 } from 'uuid';
import { statusRes } from "../interfaces";
import Users from "../schemas/userSchema";

export default async function register(req: Request, _res: Response) {
    let status = {} as statusRes;
    const { username, email, password } = req.body;
    let user
    try {
        user = await Users.create({ uuid: uuidv4(), username, email, password: bcrypt.hashSync(password, 10) });
    } catch (err: any) {
        if (err.code === 11000) {
            await logging(`Duplicate key error while creating User in DB!`, ['warn'], req);
            status.code = 409;
        } else {
            await logging(`Unknown error while creating User in DB.`, ['error'], req);
            status.code = 500;
        }
        return status;
    }

    if (status.code !== undefined) {
        await logging('Early exit: ' + JSON.stringify(status), ['error'], req);
        return status;
    }
    status.code = 201;
    await logging('User created : ' + user._id, ['debug','info.cyan'], req);
    return status;
}