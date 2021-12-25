import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uuid: String,
    username: {
        type: String,
        required: true
    },
    email: String,
    password: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', userSchema);