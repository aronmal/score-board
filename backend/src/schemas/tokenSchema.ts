import mongoose from "mongoose";
import { tokensModelName, tokensModelType, usersModelName } from "../interfaces";

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
        ref: usersModelName,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    expiresIn: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false,
        required: true
    },
})

const Tokens = mongoose.model<tokensModelType>(tokensModelName, tokenSchema);
export default Tokens;