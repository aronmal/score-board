import mongoose from "mongoose";
import { Users } from "./userSchema";

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