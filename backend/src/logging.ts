import {Response} from "express";

export function errorLog(message: string) {
    console.log('[ERROR] '.red + message);
}

export function errorRes(message: string, res: Response) {
    res.status(500).send();
    errorLog(message);
    console.log('[POST] ' + '[WARN] '.yellow + 'Request served with status 500');
}