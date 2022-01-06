import {Response} from "express";

export function debugLog(message: string) {
    console.log('[Debug] '.grey + message);
}

export function postLog(message: string) {
    console.log('[POST] ' + message);
}

export function errorLog(message: string) {
    console.log('[ERROR] '.red + message);
}

export function errorRes(message: string, res: Response) {
    res.sendStatus(500);
    errorLog(message);
    console.log('[POST] ' + '[WARN] '.yellow + 'Request served with status 500');
}