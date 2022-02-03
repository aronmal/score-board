import mongoose from "mongoose";

export type playerType = {
  uuid: string,
  name: string,
  team: string,
};

export type teamType = {
  uuid: string,
  name: string,
  players: string[],
};

export type groupType = {
  uuid: string,
  name: string,
  description: string,
  isPublic: boolean,
  doTeams: boolean,
  players: playerType[],
  teams: teamType[],
};

export type usersType = {
    uuid: string,
    username: string,
    email: string,
    password: string,
    groups: mongoose.Types.ObjectId[] | groupType[],
    templates: mongoose.Types.ObjectId[] | groupType[],
    createdAt: number,
    updatedAt: number,
}
export const usersModelName = 'users'
export type usersModelType = usersType & mongoose.Document;

export type groupsType = {
    uuid: string,
    name: string,
    description: string,
    isPublic: boolean,
    doTeams: boolean,
    players: any[],
    teams: any[],
    owner: mongoose.Types.ObjectId | usersType,
    createdAt: number,
    updatedAt: number,
}
export const groupsModelName = 'groups'
export type groupsModelType = groupsType & mongoose.Document;

export type tokenType = {
    user: string,
    iat: Date,
    exp: Date,
}

export type DBTokenType = {
    token: string,
    type: string,
    owner: mongoose.Types.ObjectId | usersType,
    createdAt: Date,
    expiresIn: Date,
    used: boolean,
}
export const tokensModelName = 'tokens'
export type tokensModelType = DBTokenType & mongoose.Document;

export type statusRes = {
    status: string,
    code: number,
    message: string,
    body: object,
}