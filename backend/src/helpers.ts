import {Response} from "express";
import {Users, userType} from "./schemas";
import {errorRes} from "./logging";
import mongoose from "mongoose";

export async function findUserByName(username: string, res:Response) {

    const userByName = await Users.find({ username: username }).catch((err: Error) => {errorRes(err.message, res)}) || [];
    const userByEmail = await Users.find({ email: username }).catch((err: Error) => {errorRes(err.message, res)}) || [];
    if (userByName.length + userByEmail.length === 0) {
        res.status(401).send();
        return;
    }

    if (userByName.length + userByEmail.length !== 1) {
        errorRes('More than one matching User found!!!', res);
        return;
    }

    const user = userByName[0] || userByEmail[0];

    return user as userType;
}

export async function findUserById(id: string, res:Response) {

    const userById = await Users.find({ _id: new mongoose.Types.ObjectId(id) });

    if (userById.length === 0) {
        res.status(401).send();
        return;
    }

    if (userById.length !== 1)
        throw new Error('More than one matching User found!!!');

    const user = userById[0];

    return user as userType;
}

export async function findUserByUuid(uuid: string, res:Response) {

    const userByUuid = await Users.find({ uuid: uuid }).catch((err: Error) => {errorRes(err.message, res)}) || [];

    if (userByUuid.length === 0) {
        res.status(401).send();
        return;
    }

    if (userByUuid.length !== 1)
        throw new Error('More than one matching User found!!!');

    const user = userByUuid[0];

    return user as userType;
}