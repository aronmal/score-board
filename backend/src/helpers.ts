import { Request, Response, NextFunction } from "express";
import { logging } from "./logging";
import { statusRes } from "./schemas";


export async function routeCatch(route: any, req: Request, res: Response, next: NextFunction) {
    if (typeof route !== 'function')
        logging('Unexpected Error: Non-function argument', ['error'], req);
    if (route.status !== undefined) {
        logging(route.message, ['error'], req);
        res.sendStatus(route.status);
        return;
    }
    let status = {} as statusRes;
    try {
        status = await route(req, res);
    } catch (err: any) {
        status.status = 'caughtError';
        logging('Catched error, giving it to the error-handling middleware.', ['debug'], req);
        return next(err);
    }
    if (status.code === undefined || status.status === 'caughtError') {
        logging('Uncaught error, giving it to the error-handling middleware.', ['debug'], req);
        return next(new Error('An unknown error occurred!'));
    }
    logging('Request served' + JSON.stringify(status), ['post'], req);
    if (!status.body) {
        res.sendStatus(status.code);
        return;
    }
    res.status(status.code).json(status.body);
}

export function errorHandling(err: any, req: Request, res: Response, _next: NextFunction) {
    res.sendStatus(500)
    logging(err.message, ['error'], req);
    logging('Request served with status 500', ['post', 'warn'], req);
}

export function jwtVerfiyCatch(tokenType: string, token: string, err:any, status: statusRes, req: Request) {
    if (err.message === 'jwt expired') {
        logging(`JWT (${tokenType}) expired!`, ['warn'], req);
        status.code = 403;
    } else if (err.message === 'invalid signature') {
        logging(`Invalid JWT (${tokenType}) signature! Token: ` + token, ['error'], req);
        status.code = 401;
    } else if (err.message === 'jwt must be provided') {
        logging(`No JWT (${tokenType}) given.`, ['error'], req);
        status.code = 401;
    } else {
        logging(`Unknown error on 'JWT.verify()'.`, ['error'], req);
        status.code = 500;
    }
}
