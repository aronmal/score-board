import { Dispatch, SetStateAction } from "react"

async function auth(setElem: Dispatch<SetStateAction<JSX.Element>>): Promise<string | undefined> {
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
    }).catch((err: Error) => {
        console.log(err)
        setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
        setTimeout(() => {
            setElem(<></>)
        }, 5000)
    })
    if (!res)
        return;
    if (res.status === 200)
        return (await res.json()).token;
    setElem(<p style={{color: 'red'}}>{ 'Error ' + res.status + ' ' + res.statusText }</p>)
    setTimeout(() => {
        setElem(<></>)
    }, 5000)
}

export default auth;