import { Request, Response} from "express";
import { logging } from "../logging";

export default function routeCatch(route: Function) {
    return async (req: Request, res: Response) => {
        try {
            await route(req, res);
        } catch (err: any) {
            res.status(500)
            await logging(err?.stack, ['error'], req);
        }
        if (!res.statusCode) {
            await logging('Uncaught error.', ['debug'], req);
        }
        if (!res.writableEnded)
            res.end();
        await logging('Request served ' + res.statusCode, res.statusCode === 500 ? ['post', 'warn'] : ['post'], req);
    }
}