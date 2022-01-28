import { Request, Response, NextFunction } from "express";
import { logging } from "../logging";

async function errorHandling(err: any, req: Request, res: Response, _next: NextFunction) {
    res.sendStatus(500)
    await logging(err.stack, ['error'], req);
    await logging('Request served with status 500', ['post', 'warn'], req);
}

export default errorHandling