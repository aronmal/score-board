import { Dispatch, SetStateAction } from "react";
import showError from "./showError";

export default async function auth(setElem: Dispatch<SetStateAction<JSX.Element>>): Promise<string | undefined> { 
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
    }).catch((err: Error) => {
        console.log(err)
        showError(setElem, err.toString(), 5000)
    })
    if (!res)
        return;
    if (res.status === 200)
        return (await res.json()).token;
    showError(setElem, 'Error ' + res.status + ' ' + res.statusText, 5000)
}