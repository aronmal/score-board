# <img src="https://raw.githubusercontent.com/aronmal/score-board/production/frontend/public/images/logo192.png" alt="icon" width="32"/> Score:Board

[![works badge](https://img.shields.io/badge/Score-Board-red)](https://scoreboard.mal-noh.de)
[![works badge](https://img.shields.io/badge/works-on%20my%20machine-brightgreen)](https://mal-noh.de)
[![works badge](https://img.shields.io/badge/Score:Board-GBS-blue)](https://gbs-grafschaft.de)

> **Under construction and not finished yet. ;)**

A full stack scoreboard to track all events during sport matches


## :rocket: Gettting started

Project powered by:

- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

First of all, you should know that the project consists of two parts, the frontend and backend.

```
/
├── backend/
├── frontend/
└── README.md
```


## :desktop_computer: Frontend

Inside of the `/frontend/` folder, you'll see the following folders and files:

```
/frontend/
├── # build/          # Will be created when running `npm run build`.
├── # node_moudules/  # Will be created when running `npm i`.
├── public/
│   ├── fonts/
│   │   └── ...
│   ├── images/
│   │   └── ...
│   ├── favicon.ico
│   ├── index.html
│   ├── main.css
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── compunents/
│   │   ├── Context.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Healpers.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Logout.tsx
│   │   ├── Newgroup.tsx
│   │   └── Register.tsx
│   ├── app.css
│   ├── app.tsx
│   ├── index.tsx
│   └── react-app-env.d.ts
├── .gitignore
├── package-lock.json
├── package.json
├── REAMDE.md
└── tsconfig.json
```

### Commands to operate

All commands are run from the `/frontend/` folder of the project, from a terminal:

| Command           | Action                                     |
|:----------------  |:-------------------------------------------|
| `npm i`           | Installs dependencies `./node_modules/`    |
| `npm start      ` | Starts local dev server at `localhost:3000`|
| `npm run build`   | Build your production site to `./build/`   |


## :white_square_button: Backend

Inside of the `/backend/` folder, you'll see the following folders and files:

```
/backend/
├── # build/          # Will be created when running `npm run build`.
├── # log/            # Will be created on first startup.
│   # └── log.txt     # Will be created on first startup.
├── # node_moudules/  # Will be created when running `npm i`.
├── src/
│   ├── helpers.ts
│   ├── index.ts
│   ├── logging.ts
│   ├── routes.ts
│   └── schemas.ts
├── # .env            # Will be created on first startup, but need to be customized.
├── .gitignore
├── package-lock.json
├── package.json
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

## 👀 Want to learn more?

:bullettrain_side: Feel free to check out [our website](https://mal-noh.de) and have a look at some ohter projects or go to [our repositories](https://github.com/aronmal?tab=repositories).
