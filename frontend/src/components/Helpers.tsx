import { Dispatch, SetStateAction } from "react";

export const loginCheck = async (): Promise<boolean | undefined> => {
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'loginCheck' }),
    }).catch((err: Error) => console.log(err))
    if (!res)
        return;
    let loginCheck = false;
    try {
        const body = await res.json()
        loginCheck = body.loggedIn
        console.log('loginCheck: ' + loginCheck)
    } catch (err: any) {
        console.log(err)
    }
    return loginCheck;
}

export const auth = async (setElem: Dispatch<SetStateAction<JSX.Element>>): Promise<string | undefined> => { 
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

export const Clock = () => {
  const h = new Date().getHours();
  const m = new Date().getMinutes();

  const hh = h < 10 ? "0" + h : h;
  const mm = m < 10 ? "0" + m : m;

  return `${hh}:${mm}`;
}

export const showError = (setElem: Dispatch<SetStateAction<JSX.Element>>, message: string, timeout: number) => {
    setElem(<p style={{color: 'red'}}>{ message }</p>)
    setTimeout(() => {
      setElem(<></>)
    }, timeout)
}