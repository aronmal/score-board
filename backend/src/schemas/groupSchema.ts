import mongoose from "mongoose";
import { groupsModelName, groupsModelType, usersModelName } from "../interfaces";

const groupSchema = new mongoose.Schema({
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
    isPublic: {
        type: Boolean,
        required: true
    },
    doTeams: {
        type: Boolean,
        required: true
    },
    players: {
        type: Array,
        required: true
    },
    teams: {
        type: Array,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: usersModelName,
        required: true
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

const Groups = mongoose.model<groupsModelType>(groupsModelName, groupSchema);
export default Groups;