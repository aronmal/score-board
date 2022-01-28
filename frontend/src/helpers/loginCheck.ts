async function loginCheck(): Promise<boolean | undefined> {
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

export default loginCheck