import fs from 'fs';
import bcrypt from 'bcrypt';
import colors from 'colors';
colors.enable();
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
const app = express();
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './Schemas';

try {
    fs.readFileSync('.env', 'utf8')
    dotenv.config();
    console.log('[INFO] '.green + `'.env' file was found.`)
} catch (err:any) {
    if (err.code === 'ENOENT') {
        console.log(`[WARN] ${err.code}: the file '.env' could not be opened!`);
        let newEnv = '\n';
        newEnv = (newEnv + 'ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
        newEnv = (newEnv + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
        newEnv = (newEnv + '# Customize: MONGO_DB=mongodb://TheUsername:UserPassword@YourMongoDBHostname:YourMongoDBPort/DBName' + '\n');
        newEnv = (newEnv + '# For example, comment out:' + '\n');
        newEnv = (newEnv + '# MONGO_DB=mongodb://username:securepassword1234@localhost:27017/testdb' + '\n');
        console.log(`[WARN] No '.env' file was found. A new one was generated.`);
        fs.writeFileSync('.env', newEnv);
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
    console.log('[ERROR] '.red +  `MONGO_DB is undefinded! Open the '.env' file, edit the MONGO_DB parameter by entering the path for your database and make shure to uncomment it.`);
    process.exit(1);
};

mongoose.connect(process.env.MONGO_DB, err => {(err === null) ? console.log('[INFO] '.green + 'Connected with Mongo!') : console.log(err + '\n' + '[ERROR] '.red + 'MongoDB connection error!')})

// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] '.cyan + 'Server running on: http://localhost:5000'))
app.use(express.json())
app.use(cors());

app.get('/api/login', async (req:any,res:any) => {
    try {
        let status
        let payload
        const user = await User.find({ username: req.headers.username });
        console.log(user.length)
        if (user.length === 1) {
            if (bcrypt.compareSync(req.headers.password, user[0].password)) {
                status = 200
                payload = { accessToken: jwt.sign({ uuid: user[0].uuid, name : user[0].username}, process.env.ACCESS_TOKEN_SECRET as string) }
                console.log(payload)
            } else {
                status = 401
            }
        } else if (user.length === 0) {
            status = 401
        } else {
            throw { message: 'More than one matching User found!!!' }
        }
        res.status(status).json({
            'data': payload
        });
        console.log('[GET] ' + 'Request served');
    } catch (e: any) {
        res.sendStatus(500)
        console.log('[GET] ' + '[ERROR] '.red + e.message);
    };
})
app.post('/api/register', async (req:any,res:any) => {
    try {
        const user = await User.create({ uuid: uuidv4(), username: req.body.username, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) });
        res.sendStatus(201)
        console.log('[POST] ' + 'Request served' + ' [INFO] User created : '.cyan + JSON.stringify(user));
    } catch (e: any) {
        res.sendStatus(500)
        console.log('[POST] ' + '[ERROR] '.red + e.message);
    };
});