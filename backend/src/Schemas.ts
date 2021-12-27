import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    username: {
        type: String,
        // unique: true,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', userSchema);