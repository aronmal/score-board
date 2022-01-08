import { Request, Response, NextFunction } from "express";
import { debugLog, objectDebugLog, postLog, warnLog, errorLog } from "./logging";
import { statusRes } from "./schemas";


export async function routeCatch(route: any, req: Request, res: Response, next: NextFunction) {
    if (typeof route !== 'function')
        errorLog('Unexpected Error: Non-function argument');
    if (route.status !== undefined) {
        errorLog(route.message);
        res.sendStatus(route.status);
        return;
    }
    let status = {} as statusRes;
    try {
        status = await route(req, res);
    } catch (err: any) {
        status.status = 'caughtError';
        debugLog('Catched error, giving it to the error-handling middleware.');
        return next(err);
    }
    if (status.code === undefined || status.status === 'caughtError') {
        debugLog('Uncaught error, giving it to the error-handling middleware.');
        return next(new Error('An unknown error occurred!'));
    }
    objectDebugLog(status);
    postLog('Request served');
    res.status(status.code);
    if (status.body === undefined) {
        res.end();
        return;
    }
    res.json(status.body);
}

export function errorHandling(err: any, req: Request, res: Response) {
    res.status(500).send();
    errorLog(err.message);
    console.log('[POST] ' + '[WARN] '.yellow + 'Request served with status 500');
}

export function jwtVerfiyCatch(tokenType: string, token: string, err:any, status: statusRes) {
    if (err.message === 'jwt expired') {
        warnLog(`JWT (${tokenType}) expired!`);
        status.code = 403;
    } else if (err.message === 'invalid signature') {
        errorLog(`Invalid JWT (${tokenType}) signature! Token: ` + token);
        status.code = 401;
    } else if (err.message === 'jwt must be provided') {
        errorLog(`No JWT (${tokenType}) given.`);
        status.code = 401;
    } else {
        errorLog(`Unknown error on 'JWT.verify()'.`);
        status.code = 500;
    }
}
