import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    data: {
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
        groups: {
            type: Array
        },
        templates: {
            type: Array
        },
    },
    password: {
        type: String,
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

export const Users = mongoose.model('users', userSchema);

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    type: {
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

export const Tokens = mongoose.model('tokens', tokenSchema);


const groupSchema = new mongoose.Schema({
    data: {
        uuid: {
            type: String,
            unique: true,
            immutable: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
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
            type: Array,
            required: true
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: Users,
            required: true
        },
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

export const Groups = mongoose.model('groups', groupSchema);