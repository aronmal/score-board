import { Request, Response } from "express";
import { logging } from "../logging";

export default async function jwtVerfiyCatch(tokenType: 'refreshToken' | 'accessToken', token: string, err: Error, req: Request, res: Response) {
    switch (err.message) {
        case 'jwt expired':
            await logging(`JWT (${tokenType}) expired!`, ['warn'], req);
            res.status(403);
            break;

        case 'invalid signature':
            await logging(`Invalid JWT (${tokenType}) signature! Token: ` + token, ['error'], req);
            res.status(401);
            break;

        case 'jwt must be provided':
            await logging(`No JWT (${tokenType}) given.`, ['warn'], req);
            res.status(401);
            break;
    
        default:
            await logging(`Unknown error on 'JWT.verify()'.`, ['error'], req);
            res.status(500);
            break;
    }
}