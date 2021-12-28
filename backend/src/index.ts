import fs from 'fs';
import bcrypt from 'bcrypt';
import colors from 'colors';
colors.enable();
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
const app = express();
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Check for dotenv file, otherwise generate one
try {
    fs.readFileSync('.env', 'utf8')
    dotenv.config();
    console.log('[INFO] '.green + `'.env' file was found.`)
} catch (err: any) {
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

// Check for dotenv file variables, otherwise throw error
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

// Connet to MongoDB 
mongoose.connect(process.env.MONGO_DB, err => {(err === null) ? console.log('[INFO] '.green + 'Connected with Mongo!') : console.log(err + '\n' + '[ERROR] '.red + 'MongoDB connection error!')})

// Schemas
const userSchema = new mongoose.Schema({
    uuid: {
        type: String
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
    password: {
        type: String,
        required: true
    }
})

const Users = mongoose.model('users', userSchema);


// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] '.cyan + 'Server running on: http://localhost:5000'))
// Middlewares
app.use(express.json())
app.use(cors());

// Login post route
app.post('/api/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        let status
        let payload
        const userByName = await Users.find({ username: username });
        const userByEmail = await Users.find({ email: username });

        if (userByName.length + userByEmail.length === 0) {
            status = 401
        } else if (userByName.length + userByEmail.length === 1) {
            const user = userByName[0] || userByEmail[0]
            if (bcrypt.compareSync(password, user.password)) {
                status = 200
                payload = { accessToken: jwt.sign({ uuid: user.uuid, name : user.username}, process.env.ACCESS_TOKEN_SECRET as string) }
                console.log('[Debug] '.grey + ' [INFO] Generated Access-Token : '.cyan + JSON.stringify(payload))
            } else {
                status = 401
            }
            res.status(status).json({
                'data': payload
            });
            console.log('[Debug] '.grey + ' [INFO] User logged in : '.cyan + JSON.stringify(user))
            console.log('[POST] ' + 'Request served');
        } else {
            throw { message: 'More than one matching User found!!!' }
        }
    } catch (err: any) {
        res.sendStatus(500)
        console.log('[POST] ' + '[ERROR] '.red + err.message);
    };
})

// Register post route
app.post('/api/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const user = await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) });
        res.sendStatus(201)
        console.log('[POST] ' + 'Request served' + ' [INFO] User created : '.cyan + JSON.stringify(user));
    } catch (err: any) {
        res.sendStatus(500)
        console.log('[POST] ' + '[ERROR] '.red + err.message);
    };
});