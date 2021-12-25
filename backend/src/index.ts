import fs from 'fs';
import bcrypt from 'bcrypt';
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
    console.log(`[INFO] '.env' file was found.`)
} catch (err:any) {
    if (err.code === 'ENOENT') {
        console.log(`[ERROR] ${err.code}: no such file or directory, open '.env'`)
        let newEnv = ('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n' + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))
        console.log(`[WARN] No '.env' file was found. A new one was generated.`)
        fs.writeFileSync('.env', newEnv)
        dotenv.config();
    } else {
        console.log(err)
    }
}

if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    console.log(`[ERROR] ACCESS_TOKEN_SECRET is undefinded! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
} else if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    console.log(`[ERROR] REFRESH_TOKEN_SECRET is undefinded! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
} else if (process.env.MONGO_DB === undefined) {
    console.log(`[ERROR] MONGO_DB is undefinded! Edit MONGO_DB parameter in the '.env' file make shure to uncomment it.`);
    process.exit(1);
};

mongoose.connect(process.env.MONGO_DB, err => {(err === null) ? console.log('[INFO] Connected with Mongo!') : console.log(err + '\n[ERROR] MongoDB connection error!')})

// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] Server running on: http://localhost:5000'))
app.use(express.json())
app.use(cors());

app.get('/api/get', async (req:any,res:any) => {
    console.log(req.body)
    if (typeof req.body.username === 'string') {
        const user = await User.findOne({ name: req.body.username })
        res.send(bcrypt.compareSync(req.body.password, user.password));
    } else {
        res.send(await User.find())
    }
    console.log('[GET] Request served')
})
app.post('/api/post', async (req:any,res:any) => {
    console.log('[POST] Recieving request:');
    console.log(req.body);
    console.log('[POST] Request received.');
    const user = await User.create({ uuid: uuidv4(), username: req.body.username, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) });
    console.log(user);
    res.json({
        status: 'success',
        message: 'received and creatd user',
        createdUser: user
    })
});