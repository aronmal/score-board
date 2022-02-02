import mongoose from "mongoose";
import { Users } from "./userSchema";

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
        ref: Users,
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

export const Groups = mongoose.model('groups', groupSchema);