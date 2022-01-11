import fs from 'fs';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { errorLog } from './logging';
import { register, login, logout, auth, newgroup } from './routes';
import { errorHandling, routeCatch } from './helpers';
colors.enable();
const app = express();

// Check for dotenv file, otherwise generate one
if (fs.existsSync('.env')) {
    dotenv.config();
    console.log('[INFO] '.green + `'.env' file was found.`)
} else {
    let newEnv = '\n';
    newEnv = (newEnv + '# Refresh-Token secret for Refresh-Token in cookie:' + '\n');
    newEnv = (newEnv + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
    newEnv = (newEnv + '# Access-Token secret for Access-Token in auth-route response body:' + '\n');
    newEnv = (newEnv + 'ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n');
    newEnv = (newEnv + '# MongoDB path (with access credentials, if necessary) for mongoose:' + '\n');
    newEnv = (newEnv + '### MONGO_DB=mongodb://username:securepassword1234@localhost:27017/dbname' + '\n');
    newEnv = (newEnv + '# CORS origin header:' + '\n');
    newEnv = (newEnv + '### CORS_HOST=https://scoreboard.your-domain.com' + '\n');
    newEnv = (newEnv + '# API port:' + '\n');
    newEnv = (newEnv + '### API_PORT=5000' + '\n');
    console.log('[WARN] '.yellow + `No '.env' file was found. A new one was generated.`);
    fs.writeFileSync('.env', newEnv);
    dotenv.config();
}

// Check for dotenv file variables, otherwise throw error
if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    errorLog(`ACCESS_TOKEN_SECRET is undefined! Delete the '.env' file, a new one will be generated on startup.`);
    process.exit(0);
}
if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    errorLog(`REFRESH_TOKEN_SECRET is undefined! Delete the '.env' file, a new one will be generated on startup.`);
    process.exit(0);
}
if (process.env.MONGO_DB === undefined) {
    errorLog(`MONGO_DB is undefined! Open the '.env' file, edit the MONGO_DB parameter by entering the path for your database and make sure to uncomment it.`);
    process.exit(0);
}
if (process.env.CORS_HOST === undefined) {
    errorLog(`CORS_HOST is undefined! Open the '.env' file, edit the CORS_HOST parameter by entering the hostname for your website and make sure to uncomment it.`);
    process.exit(0);
}
if (process.env.API_PORT === undefined) {
    errorLog(`API_PORT is undefined! Open the '.env' file, edit the API_PORT parameter by entering the port for your backend and make sure to uncomment it.`);
    process.exit(0);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, err => {
    if (err) {
        errorLog('MongoDB connection error!');
        process.exit(0);
    }
    console.log('[INFO] '.green + 'Connected with Mongo!');
});

// Start listening on port 5000
app.listen(process.env.API_PORT, () => console.log('[INFO] '.cyan + `Server running on: ${process.env.CORS_HOST}:${process.env.API}`))

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_HOST,
  }));

// Register post route
app.post('/api/register', (req, res, next) => {next(register)});

// Login post route
app.post('/api/login', (req, res, next) => {next(login)});

// Logout delete route
app.delete('/api/logout', (req, res, next) => {next(logout)});

// Auth post route
app.post('/api/auth', (req, res, next) => {next(auth)});

// New group post route
app.post('/api/newgroup', (req, res, next) => {next(newgroup)});


// Middlewares
// Exexute the given route function and catch all error and respond propper
app.use(routeCatch);
// Error handling
app.use(errorHandling);