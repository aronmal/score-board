import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import showError from '../helpers/showError';
import { loginContext }  from '../context';
import { ss } from '../helpers/styles';

export default function Login() {

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
        <div className={`flex-col ${ss.stepForm}`}>
            <div className="flex-col relative">
                <h2>Login</h2>
                <div className={ss.gridSplit}>
                    <p style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername oder E-Mail:</p>
                    <input
                        className={ss.inputBox}
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyDown={e => {
                            if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) login()
                        }}
                    />
                    <p style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</p>
                    <input
                        className={ss.inputBox}
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => {
                            if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) login()
                        }}
                    />
                </div>
                { elem }
            </div>
            <div className={ss.steps}>
                <div className='flex-row' style={{float: 'right'}}>
                <button className={ss.nextStepButton} onClick={() => login()}>{'Login \u279C'}</button>
                </div>
            </div>
        </div>
    )
}
