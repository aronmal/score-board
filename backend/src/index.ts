import fs from 'fs';
import cors from 'cors';
import express from 'express';
const app = express();
require('dotenv').config();

try {
    fs.readFileSync('.env', 'utf8')
} catch (err:any) {
    if (err.code === 'ENOENT') {
        console.log(`[ERROR] ${err.code}: no such file or directory, open '.env'`)
        let newEnv = ('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex') + '\n' + 'REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))
        console.log('[WARN] No .env file was found. A new one was generated.')
        fs.writeFileSync('.env', newEnv)
        require('dotenv').config();
    } else {
        console.log(err)
    }
}

if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    console.log('[ERROR] ACCESS_TOKEN_SECRET is undefinded! Delete the .env file and a new one will be generated on startup.');
    process.exit(1);
} else if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    console.log('[ERROR] REFRESH_TOKEN_SECRET is undefinded! Delete the .env file and a new one will be generated on startup.');
    process.exit(1);
};


let configFileData:any
let newConfigFileData:any

// Start listening on port 5000
app.listen(5000, () => console.log('[INFO] Server running on: http://localhost:5000'))
app.use(express.static('../frontend/build'))
app.use(express.json())
app.use(cors());

app.get('/api/get', (req:any,res:any) => {
    readConfig()
    res.send(JSON.parse(configFileData))
    console.log('[GET] Request served')
})
app.post('/api/post', (req:any,res:any) => {
    readConfig()
    console.log('[POST] Recieving request:')
    newConfigFileData = req.body
    console.log(req.body)
    console.log('[POST] Request received.')
    saveConfig()
    res.json({
        status: 'success',
        message: 'received'
    })
})




async function readConfig() {
    try {
        configFileData = fs.readFileSync('./src/config.json', 'utf8')
      } catch (err) {
        console.error(err)
      }
}

// if new configuration, write to file
function saveConfig() {
    if ((configFileData !== newConfigFileData) && (newConfigFileData !== undefined))  {
        try {
            console.log('[Info] Saving new config ...')
            fs.writeFileSync('./src/config.json', JSON.stringify(newConfigFileData))
            //file written successfully
            console.log('[Info] Data written, config saved!')
        } catch (err) {
            //error message
            console.error(err)
        }
    } else if (configFileData === newConfigFileData) {
        console.log('No writing action, new config and config file are the same.')
    } else if (newConfigFileData == undefined) {
        console.log('No writing action, new config is undefined')
    } else {
        console.log('New config not saved, an unknown error accured!')
    }
}