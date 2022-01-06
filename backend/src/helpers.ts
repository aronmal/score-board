import { Request, Response, NextFunction } from "express";
import { errorLog, errorRes } from "./logging";


export async function routeCatch(route: Function, req: Request, res: Response, next: NextFunction) {
    try {
        await route(req, res);
    } catch (e: any) {
        return next(e)
    }
}

export function errorHandling(err: any, req: Request, res: Response, next: NextFunction) {
    res.sendStatus(500);
    errorLog(err.message);
    console.log('[POST] ' + '[WARN] '.yellow + 'Request served with status 500');
}

export async function jwtVerfiyCatch(tokenType: string, token: string, err:any, res: Response) {
    if (err.message === 'jwt expired') {
        console.log('[WARN] '.yellow + `JWT (${tokenType}) expired!`);
        res.sendStatus(403);
        return;
    }
    if (err.message === 'invalid signature') {
        errorLog(`Invalid JWT (${tokenType}) signature! Token: ` + token);
        res.sendStatus(401);
        return;
    }
    if (err.message === 'jwt must be provided') {
        errorLog(`No JWT (${tokenType}) given.`);
        res.sendStatus(401);
        return;
    }
    errorRes(err.message, res);
}
