import mongoose from "mongoose";

export type userType = {
    _id: mongoose.Types.ObjectId,
    uuid: string,
    username: string,
    email: string,
    password: string,
    groups: mongoose.Types.ObjectId[],
    templates: mongoose.Types.ObjectId[],
    createdAt: number,
    updatedAt: number,
    save: Function,
}

export type userDataType = {
    uuid: string,
    username: string,
    email: string,
    // groups: mongoose.Types.ObjectId[],
    // templates: mongoose.Types.ObjectId[],
}

export type groupType = {
    _id: mongoose.Types.ObjectId,
    uuid: string,
    name: string,
    description: string,
    isPublic: boolean,
    doTeams: boolean,
    players: any[],
    teams: any[],
    owner: mongoose.Types.ObjectId,
    createdAt: number,
    updatedAt: number,
    save: Function,
}

export type groupDataType = {
    uuid: string,
    name: string,
    description: string,
    isPublic: boolean,
    doTeams: boolean,
    players: any[],
    teams: any[],
    owner: mongoose.Types.ObjectId,
}

export type tokenType = {
    user: string,
    iat: Date,
    exp: Date,
}

export type DBTokenType = {
    token: string,
    owner: mongoose.Types.ObjectId,
    createdAt: Date,
    expiresIn: Date,
    used: boolean,
    save: Function,
}

export type statusRes = {
    status: string,
    code: number,
    message: string,
    body: object,
}