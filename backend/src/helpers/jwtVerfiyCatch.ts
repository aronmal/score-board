import { Request } from "express";
import { logging } from "../logging";
import { statusRes } from "../interfaces";

async function jwtVerfiyCatch(tokenType: string, token: string, err:any, loginCheck: boolean, status: statusRes, req: Request) {
    if (loginCheck) {
        status.code = 200;
        status.body = { loggedIn: false };
        await logging('loginCheck: ' + loginCheck, ['debug','info.cyan'], req)
    } else if (err.message === 'jwt expired') {
        await logging(`JWT (${tokenType}) expired!`, ['warn'], req);
        status.code = 403;
    } else if (err.message === 'invalid signature') {
        await logging(`Invalid JWT (${tokenType}) signature! Token: ` + token, ['error'], req);
        status.code = 401;
    } else if (err.message === 'jwt must be provided') {
        await logging(`No JWT (${tokenType}) given.`, ['error'], req);
        status.code = 401;
    } else {
        await logging(`Unknown error on 'JWT.verify()'.`, ['error'], req);
        status.code = 500;
    }
}

export default jwtVerfiyCatch