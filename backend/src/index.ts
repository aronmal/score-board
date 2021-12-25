import fs from 'fs';
import bcrypt from 'bcrypt';
import colors from 'colors';
colors.enable();
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
const app = express();
// import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './Schemas';

try {
    fs.readFileSync('.env', 'utf8')
    dotenv.config();
    console.log('[INFO] '.green + `'.env' file was found.`)
} catch (err:any) {
    if (err.code === 'ENOENT') {
        console.log('[ERROR] '.red + `${err.code}: no such file or directory, open '.env'`)
        let newEnv = ('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n' + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))
        console.log('[WARN] '.yellow + `No '.env' file was found. A new one was generated.`)
        fs.writeFileSync('.env', newEnv)
        dotenv.config();
    } else {
        console.log(err)
    }
}

if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    console.log('[ERROR] '.red + `ACCESS_TOKEN_SECRET is undefinded! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
} else if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    console.log('[ERROR] '.red + `REFRESH_TOKEN_SECRET is undefinded! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
} else if (process.env.MONGO_DB === undefined) {
    console.log('[ERROR] '.red +  `MONGO_DB is undefinded! Edit MONGO_DB parameter in the '.env' file make shure to uncomment it.`);
    process.exit(1);
};

mongoose.connect(process.env.MONGO_DB, err => {(err === null) ? console.log('[INFO] '.green + 'Connected with Mongo!') : console.log(err + '\n' + '[ERROR] '.red + 'MongoDB connection error!')})

// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] '.cyan + 'Server running on: http://localhost:5000'))
app.use(express.json())
app.use(cors());

app.post('/api/get', async (req:any,res:any) => {
    try {
        const payload = await User.find({ username: req.body.username });
        if (payload.length === 1) {
            res.json({
                status: 'success',
                message: 'found user',
                data: payload
            });
            console.log('[POST] ' + 'Request served');
        } else {
            res.json({
                status: 'nonsuccess',
                message: 'no user found'
            });
            console.log('[POST] ' + 'Request served');
        }
    } catch (e: any) {
        const payload = e.message
        res.json({
            status: 'error',
            message: 'An error occurred!',
            error: payload
        });
        console.log('[POST] ' + '[ERROR] '.red + e.message);
    };
})
app.post('/api/post', async (req:any,res:any) => {
    try {
        const payload = await User.create({ uuid: uuidv4(), username: req.body.username, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) });
        res.json({
            status: 'success',
            message: 'received and created user',
            createdUser: payload
        });
        console.log('[POST] ' + 'Request served' + ' [INFO] '.cyan + 'User created');
    } catch (e: any) {
        const payload = e.message
        res.json({
            status: 'error',
            message: 'An error occurred!',
            error: payload
        });
        console.log('[POST] ' + '[ERROR] '.red + e.message);
    };
});