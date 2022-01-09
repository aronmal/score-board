import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function Login() {

    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [elem, setElem] = useState(<></>);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isLoggedIn)
            setElem(<Navigate to='/' />)
    }, [isLoggedIn]);

    async function login() {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ 'username': username, 'password': password })
        }).catch((err: Error) => {
            console.log(err)
            setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 5000)
        })
        if (!res)
            return;
        if (res.status === 200) {
            setIsLoggedIn(true)
        } else if (res.status === 401) {
            setElem(<p style={{color: 'red'}}>Benutzername oder Passwort ungültig!</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 3000)
        } else {
            console.log(res)
            setElem(<p style={{color: 'red'}}>{ 'Error ' + res.status + ' ' + res.statusText }</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 5000)
        }
    }

    return (
        <>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername oder E-Mail:</label>
                <input
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => {
                      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) login()
                    }}
                />
            </div>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</label>
                <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => {
                      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) login()
                    }}
                />
            </div>
            <button onClick={() => login()}>Login</button>
            {elem}
        </>
    )
}

export default Login
