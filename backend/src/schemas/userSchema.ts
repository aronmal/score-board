import mongoose from "mongoose";
import { groupsModelName, usersModelName, usersModelType } from "../interfaces";

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
    passwordHash: {
        type: String,
        required: true
    },
    groups: [{
        type: mongoose.Types.ObjectId,
        ref: groupsModelName,
        required: true
    }],
    templates: [{
        type: mongoose.Types.ObjectId,
        ref: groupsModelName,
        required: true
    }],
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

const Users = mongoose.model<usersModelType>(usersModelName, userSchema);
export default Users;