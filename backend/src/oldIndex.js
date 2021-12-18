const cors = require('cors');
const express = require('express')
const app = express()
const fs = require('fs')

var configFileData
var newConfigFileData

// Start listening on port 5000
app.listen(5000, () => console.log('Server running on: http://localhost:5000'))
app.use(express.static('public'))
app.use(express.json())
app.use(cors());

app.get('/api/get', (req,res) => {
    readConfig()
    res.send(JSON.parse(configFileData))
    console.log('[GET] Request served')
})
app.post('/api/post', (req,res) => {
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
        configFileData = fs.readFileSync('config.json', 'utf8')
      } catch (err) {
        console.error(err)
      }
}

// if new configuration, write to file
function saveConfig() {
    if ((configFileData !== newConfigFileData) && (newConfigFileData !== undefined))  {
        try {
            console.log('[Info] Saving new config ...')
            fs.writeFileSync('config.json', JSON.stringify(newConfigFileData))
            //file written successfully
            console.log('[Info] Data written, config saved!')
        } catch (err) {
            //error message
            console.error(err)
        }
    } else if (configFileData !== newConfigFileData) {
        console.log('No writing action, new config and config file are the same.')
    } else if (newConfigFileData == undefined) {
        console.log('No writing action, new config is undefined')
    } else {
        console.log('New config not saved, an unknown error accured!')
    }
}