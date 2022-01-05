import fs from 'fs';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { errorLog} from './logging';
import { register, login, auth, newgroup } from './routes';
colors.enable();
const app = express();

// Check for dotenv file, otherwise generate one
if (fs.existsSync('.env')) {
    dotenv.config();
    console.log('[INFO] '.green + `'.env' file was found.`)
} else {
    let newEnv = '\n';
    newEnv = (newEnv + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
    newEnv = (newEnv + 'ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
    newEnv = (newEnv + '# Customize: MONGO_DB=mongodb://TheUsername:UserPassword@YourMongoDBHostname:YourMongoDBPort/DBName' + '\n');
    newEnv = (newEnv + '# For example, comment out:' + '\n');
    newEnv = (newEnv + '# MONGO_DB=mongodb://username:securepassword1234@localhost:27017/dbname' + '\n');
    console.log('[WARN] '.yellow + `No '.env' file was found. A new one was generated.`);
    fs.writeFileSync('.env', newEnv);
    dotenv.config();
}

// Check for dotenv file variables, otherwise throw error
if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    errorLog(`ACCESS_TOKEN_SECRET is undefined! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
}

if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    errorLog(`REFRESH_TOKEN_SECRET is undefined! Delete the '.env' file and a new one will be generated on startup.`);
    process.exit(1);
}

if (process.env.MONGO_DB === undefined) {
    errorLog(`MONGO_DB is undefined! Open the '.env' file, edit the MONGO_DB parameter by entering the path for your database and make sure to uncomment it.`);
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB as string, err => { (err === null) ? console.log('[INFO] '.green + 'Connected with Mongo!') : (errorLog('MongoDB connection error!'), process.exit(1)) })

// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] '.cyan + 'Server running on: http://localhost:5000'))

// Middlewares
app.use(express.json())
app.use(cookieParser());
app.use(cors());

// Register post route
app.post('/api/register', register);

// Login post route
app.post('/api/login', login);

// Auth get route
app.get('/api/auth', auth);

// New group post route
app.post('/api/newgroup', newgroup);