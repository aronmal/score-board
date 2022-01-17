# :desktop_computer: **Frontend**

Inside of the project's `/frontend/` folder, you'll see the following folders and files:

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

## **Commands to operate**

All commands are run from the `/frontend/` folder of the project, from a terminal:

| Command           | Action                                     |
|:----------------  |:-------------------------------------------|
| `npm i`           | Installs dependencies `./node_modules/`    |
| `npm start      ` | Starts local dev server at `localhost:3000`|
| `npm run build`   | Build your production site to `./build/`   |

---

<br>
<br>

> Everything below **here** was from the original `Create React App` README.md

<br>

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available React  App Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
