import fs from 'fs';
import bcrypt from 'bcrypt';
import colors from 'colors';
colors.enable();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
const app = express();
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Check for dotenv file, otherwise generate one
if (fs.existsSync('.env')) {
    dotenv.config();
    console.log('[INFO] '.green + `'.env' file was found.`)
} else {
    let newEnv = '\n';
    newEnv = (newEnv + 'ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
    newEnv = (newEnv + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
    newEnv = (newEnv + '# Customize: MONGO_DB=mongodb://TheUsername:UserPassword@YourMongoDBHostname:YourMongoDBPort/DBName' + '\n');
    newEnv = (newEnv + '# For example, comment out:' + '\n');
    newEnv = (newEnv + '# MONGO_DB=mongodb://username:securepassword1234@localhost:27017/testdb' + '\n');
    console.log('[WARN] '.yellow + `No '.env' file was found. A new one was generated.`);
    fs.writeFileSync('.env', newEnv);
    dotenv.config();
}

// Check for dotenv file variables, otherwise throw error
if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    errorLog(`ACCESS_TOKEN_SECRET is undefinded! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
}

if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    errorLog(`REFRESH_TOKEN_SECRET is undefinded! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
}

if (process.env.MONGO_DB === undefined) {
    errorLog(`MONGO_DB is undefinded! Open the '.env' file, edit the MONGO_DB parameter by entering the path for your database and make shure to uncomment it.`);
    process.exit(1);
};

// Connet to MongoDB 
mongoose.connect(process.env.MONGO_DB, err => { (err === null) ? console.log('[INFO] '.green + 'Connected with Mongo!') : console.log(err + '\n' + '[ERROR] '.red + 'MongoDB connection error!') })

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

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: Users,
        required: true
    }
})

const Tokens = mongoose.model('tokens', tokenSchema);


// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] '.cyan + 'Server running on: http://localhost:5000'))
// Middlewares
app.use(express.json())
app.use(cookieParser());
app.use(cors());

function errorLog(message: string) {
    console.log('[ERROR] '.red + message);
}

function errorRes(message: string, res: Response) {
    res.status(500).send();
    errorLog(message);
    console.log('[POST] ' + '[WARN] '.yellow + 'Request served with status 500');
}

// Login post route
app.post('/api/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    const userByName = await Users.find({ username: username }).catch((err: Error) => {errorRes(err.message, res)}) || [];
    const userByEmail = await Users.find({ email: username }).catch((err: Error) => {errorRes(err.message, res)}) || [];

    if (userByName.length + userByEmail.length === 0) {
        res.status(401).send();
        return;
    }

    if (userByName.length + userByEmail.length !== 1) {
        errorRes('More than one matching User found!!!', res);
        return;
    }

    const user = userByName[0] || userByEmail[0]
    if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).send();
        return;
    }

    const resPayload: string = jwt.sign({ uuid: user.uuid, name: user.username }, process.env.ACCESS_TOKEN_SECRET as string)
    console.log('[Debug] '.grey + ' [INFO] Generated Access-Token : '.cyan + JSON.stringify(resPayload))
    console.log(req.cookies)
    const token = await Tokens.create({ token: resPayload, owner: user._id }).catch((err: Error) => {errorRes(err.message,res)})
    console.log(await token.populate({ path: 'owner', model: Users }))
    res.status(200).cookie('token', resPayload, {
        domain: 'localhost',
        maxAge: 172800,
        httpOnly: true,
        // secure: true,
        path: '/api/auth'
    }).json(user);
    console.log('[Debug] '.grey + ' [INFO] User logged in : '.cyan + JSON.stringify(user))
    console.log('[POST] ' + 'Request served');
})

// Register post route
app.post('/api/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const user = await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) }).catch((err: Error) => {errorRes(err.message,res)})
    if (!user)
        return
    res.status(201).send()
    console.log('[POST] ' + 'Request served' + ' [INFO] User created : '.cyan + JSON.stringify(user));
});

// Auth gett route
app.get('/api/auth', async (req: Request, res: Response) => {
    const token: string = req.cookies.token
    const validToken = await Users.exists({ token: token }).catch((err: Error) => {errorRes(err.message, res)});
    console.log(validToken)
    console.log(token)
    const reqPayload = await new Promise(resolve => resolve(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string))).catch((err: string) => {errorRes(err,res)})
    console.log(!!reqPayload)
    // const user = await Users.create({ uuid: uuidv4(), username: username, email: email, password: bcrypt.hashSync(password, 10) }).catch((err: Error) => {errorRes(err.message,res)})
    res.status(200).send()
    const user = 'test'
    console.log('[GET] ' + 'Request served' + ' [INFO] User created Auth Token : '.cyan + JSON.stringify(user));
});