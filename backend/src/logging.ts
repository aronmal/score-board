export function debugLog(message: string | number) {
    console.log('[Debug] '.grey + message);
}

export function objectDebugLog(object: object) {
    console.log('[Debug] '.grey + '\u2193');
    console.log(object);
    console.log('[Debug] '.grey + '\u2191');
}

export function postLog(message: string | number) {
    console.log('[POST] ' + message);
}

export function warnLog(message: string | number) {
    console.log('[WARN] '.yellow + message);
}

export function errorLog(message: string | number) {
    console.log('[ERROR] '.red + message);
}
