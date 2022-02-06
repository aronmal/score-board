import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { logging } from "../logging";
import { v4 as uuidv4 } from 'uuid';
import Users from "../schemas/userSchema";

export default async function register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    let user
    try {
        user = await Users.create({ uuid: uuidv4(), username, email, passwordHash: bcrypt.hashSync(password, 10) });
    } catch (err: any) {
        if (err.code === 11000) {
            await logging(`Duplicate key error while creating User in DB!`, ['warn'], req);
            res.status(409);
        } else {
            await logging(`Unknown error while creating User in DB.`, ['error'], req);
            res.status(500);
        }
        return;
    }

    if (res.statusCode !== 200) {
        await logging('Early exit: ' + res.statusCode, ['warn'], req);
        return;
    }
    res.status(201);
    await logging('User created : ' + user._id, ['debug','info.cyan'], req);
    return;
}