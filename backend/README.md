

## :white_square_button: Backend

Inside of the project's `/backend/` folder, you'll see the following folders and files:

```
/backend/
├── # build/          # Will be created when running `npm run build`.
├── # log/            # Will be created on first startup.
│   # └── log.txt     # Will be created on first startup.
├── # node_moudules/  # Will be created when running `npm i`.
├── src/
│   ├── helpers
│   │   ├── errorHandling.ts
│   │   ├── jwtVerfiyCatch.ts
│   │   └── routeCatch.ts
│   ├── routes
│   │   ├── auth.ts
│   │   ├── data.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   ├── newgroup.ts
│   │   └── register.ts
│   ├── schemas
│   │   ├── groupSchema.ts
│   │   ├── tokenSchema.ts
│   │   └── userSchema.ts
│   ├── index.ts
│   ├── interfaces.ts
│   └── logging.ts
├── # .env            # Will be created on first startup, but need to be customized.
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

<img src="https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.png" alt="icon" width="32"/> The default `.env` file will look as shown below. You should customise and uncomment `MONGO_DB`, `CORS_HOST` and `API_PORT` parameters.

```
# Refresh-Token secret for Refresh-Token in cookie:
REFRESH_TOKEN_SECRET=b57d461c6406a86c2efc8814c07da81f5e0d5e597e16c7179d36935a01cb65797f2acde16423fc07da153c56f3d3b70cee3cb25db958fef2523b9bb1ed9b3c14
# Access-Token secret for Access-Token in auth-route response body:
ACCESS_TOKEN_SECRET=a7a2871b1aff95dc19bbdaa510492fcbafaa0fcf8004bf1b2e648cd406596f5a24bdae4cc05f5fe59b75cd712af2237e13ebc08b5b8145182d90a62328d7a81c
# MongoDB path (with access credentials, if necessary) for mongoose:
### MONGO_DB=mongodb://username:securepassword1234@localhost:27017/dbname
# CORS origin header:
### CORS_HOST=https://scoreboard.your-domain.com
# API port:
### API_PORT=5000
```

### Commands to operate

All commands are run from the `/backend` folder of the project, from a terminal:

| Command           | Action                                           |
|:----------------  |:------------------------------------------------ |
| `npm i`           | Installs dependencies                            |
| `npm start      ` | Starts the production backend from `./build/`    |
| `npm test`        | Starts nodemon dev server at `CORS_HOST:API_PORT`|
| `npm run build`   | Build your production backend to `./build/`      |
