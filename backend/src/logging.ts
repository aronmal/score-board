export function debugLog(object: string | number | object) {
    console.log('[Debug] '.grey, object);
}

export function postLog(object: string | number | object) {
    console.log('[POST] ', object);
}

export function warnLog(object: string | number | object) {
    console.log('[WARN] '.yellow, object);
}

export function errorLog(object: string | number | object) {
    console.log('[ERROR] '.red, object);
}
