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