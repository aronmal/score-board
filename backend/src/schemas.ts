// Schemas
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        immutable: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    groups: {
        type: Array
    },
    templates: {
        type: Array
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

export interface userType {
    _id: mongoose.Types.ObjectId,
    uuid: string,
    username: string,
    email: string,
    password: string,
    groups: any[],
    templates: any[],
    createdAt: Date,
    updatedAt: Date,
    save: Function,
}

export const Users = mongoose.model('users', userSchema);

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: Users,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    expiresIn: {
        type: Date
    },
    used: {
        type: Boolean,
        default: false
    },
})

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

export const Tokens = mongoose.model('tokens', tokenSchema);


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    players: {
        type: Array,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: true
    },
    teams: {
        type: Array
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: Users,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

export const Groups = mongoose.model('groups', groupSchema);

export interface statusRes {
    status: string,
    code: number,
    message: string,
    body: object,
}