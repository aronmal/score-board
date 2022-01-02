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
    }
})

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
    teams: {
        type: Array
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: Users,
        required: true
    }
})

export const Groups = mongoose.model('groups', groupSchema);