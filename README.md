# <img src="https://raw.githubusercontent.com/aronmal/score-board/production/frontend/public/images/logo192.png" alt="icon" width="32"/> Score:Board

[![works badge](https://img.shields.io/badge/Score-Board-red)](https://scoreboard.mal-noh.de)
[![works badge](https://img.shields.io/badge/works-on%20my%20machine-brightgreen)](https://mal-noh.de)
[![works badge](https://img.shields.io/badge/Score:Board-GBS-blue)](https://gbs-grafschaft.de)

> **Under construction and not finished yet. ;)**

A full stack scoreboard to track all events during sport matches


## :rocket: **Gettting started**

The Project is powered by:

- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

First of all, you should know that the project consists of two parts, the `frontend` and `backend`.

```
/
├── backend/
│   ├── ...
│   ├── ...
│   └── README.md
├── frontend/
│   ├── ...
│   ├── ...
│   └── README.md
└── README.md
```

The `frontend` is utilising [React](https://reactjs.org/) and [React Router](https://www.npmjs.com/package/react-router-dom) coded with [TypeScript](https://www.typescriptlang.org/) (Credits to: [Create React App](https://create-react-app.dev/docs/getting-started/) typescript template).


The `backend` is utilising a [MongoDB](https://www.mongodb.com/) Database and [Node.js](https://nodejs.org/en/) (with the help of [express](https://www.npmjs.com/package/express), [Mongoose](https://www.npmjs.com/package/mongoose) and many other packages) coded with [TypeScript](https://www.typescriptlang.org/).

## **Setup**

>You need to have NodeJS installed. The process of installing NodeJS will not be covered here.

It is recommended to use [NGINX](https://nginx.org/en/) as the webserver and reverse proxy. By doing so, you can host the frontend directly and proxy the running [Node.js](https://nodejs.org/en/) backend instance.

### **Get frontend resources:**

Execude `npm i` and `npm run build` inside of the frontend folder. After this, you should see `~/frontend/build`. The content of the folder should be uploaded or moved to the webserver's working directory.

### **Get backend resources:**

Execude `npm i` and `npm run build` inside of the backend folder. After this, you should see `~/backend/build`. The production files can be started by executing `npm start` in `~/backend` (**NOT INSIDE** `~/backend/build`). If you use the [NodeJS Docker Image](https://hub.docker.com/_/node/) (recommended) follow the steps below.

### **NodeJS Configuration**

>You need to have Docker installed. The process of installing Docker will not be covered here.

Firstly, pull the [NodeJS Docker Image](https://hub.docker.com/_/node/)
```
docker pull node
```

You can start the NodeJS docker container
```
docker run -it -rm --name='nodejs' -v '/WORKDIR/app':'/usr/src/app' -w /usr/src/app 'node:latest' npm start
```

Or run it detached:
```
docker run -d --name='nodejs' -v '/WORKDIR/app':'/usr/src/app' -w /usr/src/app 'node:latest' npm start
```

In both cases you mainly need to modify the working directory path `WORKDIR` to point where you want to run the backend from. The `app` folder need to contain at least the following files and folders (Which you will get from this repo's `/backend/`):

```
~/app/
    ├── build/
    │   ├── ...
    │   ├── ...
    │   └── ...
    ├── node_modules/
    │   ├── ...
    │   ├── ...
    │   └── ...
    ├── .env
    ├── package.json
    └── package-lock.json
```


### **NGINX Configuration**

>You need to have NGINX installed. The process of installing NGINX will not be covered here.

 If you have  NGINX installed on your local machine, the root path is probably `/var/www/html/`. Here you can create a folder and paste the content of `~/frontend/build/` It could be different if you are using NGINX dockerized. The same applies to the configuration files. The default location for them should be inside `/etc/nginx/sites-enabled/`. Create a file, e.g. `scoreboard.conf` and paste the sample configuration from down below.
 
 Sample configuration, which you will need to adjusted first:

```
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    # The hostname, your webserver will listen for.
    # This needs to be the same as the CORS_HOST paramter of your backend '.env' file
    # server_name *name*;


    # all ssl related config moved to ssl.conf
    # nginx container, edit only if needed
    include /config/nginx/ssl.conf;
    include /config/nginx/proxy.conf;


    # Enter your root folder here.
    # You maybe want to customize the hole path matching your need.
    # Paste the content of your ~/frontend/build folderinside here.
    # example:
    # root /var/www/html/score-board;

    index index.html;

    location / {
        try_files $uri /index.html =404;
    }
    location /api/ {
        # This will reverse proxy to the backend.
        # Let it point to your nodejs instance.
        # The url should look like:
        # http://NodeJS_IP:API_PORT
        # example:
        # proxy_pass *url*;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

 Your final configuration file should look like: 

```
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name scoreboard-domain.com;

    # all ssl related config moved to ssl.conf
    # nginx container, edit only if needed
    include /config/nginx/ssl.conf;
    include /config/nginx/proxy.conf;

    root /var/www/html/score-board;

    index index.html;

    location / {
        try_files $uri /index.html =404;
    }
    location /api/ {
        proxy_pass http://192.168.178.35:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```


## 👀 Want to learn more?

:bullettrain_side: Feel free to check out [our website](https://mal-noh.de) and have a look at some ohter projects or go to [our repositories](https://github.com/aronmal?tab=repositories).
