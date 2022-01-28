import { Request, Response, NextFunction } from "express";
import { logging } from "../logging";
import { statusRes } from "../interfaces";

async function routeCatch(route: any, req: Request, res: Response, next: NextFunction) {
    if (typeof route !== 'function')
        await logging('Unexpected Error: Non-function argument', ['error'], req);
    if (route.status !== undefined) {
        await logging(route.stack, ['error'], req);
        res.sendStatus(route.status);
        return;
    }
    let status = {} as statusRes;
    try {
        status = await route(req, res);
    } catch (err: any) {
        status.status = 'caughtError';
        await logging('Catched error, giving it to the error-handling middleware.', ['debug'], req);
        return next(err);
    }
    if (status.code === undefined || status.status === 'caughtError') {
        await logging('Uncaught error, giving it to the error-handling middleware.', ['debug'], req);
        return next(new Error('An unknown error occurred!'));
    }
    await logging('Request served ' + JSON.stringify(status), ['post'], req);
    if (!status.body) {
        res.sendStatus(status.code);
        return;
    }
    res.status(status.code).json(status.body);
}

export default routeCatch