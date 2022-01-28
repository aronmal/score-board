import { Dispatch, SetStateAction } from "react";
import { userType } from "../interfaces";
import showError from "./showError";

async function reqData(token: string, setElem: Dispatch<SetStateAction<JSX.Element>>): Promise<userType | undefined> {
    const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
    }).catch((err: Error) => console.log(err))
    if (!res)
        return;
    if (res.status === 200)
        return (await res.json()).data;
    showError(setElem, 'Error ' + res.status + ' ' + res.statusText, 5000)
}

export default reqData