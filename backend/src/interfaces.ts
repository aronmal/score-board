import mongoose from "mongoose";

export interface userType {
    _id: mongoose.Types.ObjectId,
    data: {
        uuid: string,
        username: string,
        email: string,
        groups: any[],
        templates: any[],
    },
    password: string,
    createdAt: Date,
    updatedAt: Date,
    save: Function,
}

export interface tokenType {
    user: string,
    iat: Date,
    exp: Date,
}

export interface DBTokenType {
    token: string,
    owner: mongoose.Types.ObjectId,
    createdAt: Date,
    expiresIn: Date,
    used: boolean,
    save: Function,
}

export interface statusRes {
    status: string,
    code: number,
    message: string,
    body: object,
}