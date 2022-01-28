import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './context';
import { showError } from './helpers';

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
            showError(setElem, err.toString(), 5000)
        })
        if (!res)
            return;
        if (res.status === 200) {
            setIsLoggedIn(true)
        } else if (res.status === 401) {
            showError(setElem, 'Benutzername oder Passwort ungültig!', 3000)
        } else {
            console.log(res)
            showError(setElem, 'Error ' + res.status + ' ' + res.statusText, 5000)
        }
    }

    return (
        <div className='flex-col step-form'>
            <h2>Login</h2>
            <div className="grid-2-col-auto-50">
                <p style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername oder E-Mail:</p>
                <input
                    className='input-box'
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => {
                        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) login()
                    }}
                />
                <p style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</p>
                <input
                    className='input-box'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => {
                        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) login()
                    }}
                />
            </div>
            <div className='steps'>
                <div className='flex-row' style={{float: 'right'}}>
                <button className='next-step-button' onClick={() => login()}>{'Login \u279C'}</button>
                </div>
            </div>
            { elem }
        </div>
    )
}

export default Login
