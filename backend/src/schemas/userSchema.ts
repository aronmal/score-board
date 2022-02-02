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

export const Users = mongoose.model('users', userSchema);