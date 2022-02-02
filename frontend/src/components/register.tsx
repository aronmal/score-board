import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import showError from '../helpers/showError';
import { loginContext }  from '../context';
import { as, ss } from '../helpers/styles';
import classNames from 'classnames';

export default function Register() {
    
    const { isLoggedIn } = useContext(loginContext);
    const [elem, setElem] = useState(<></>);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordChecked, setPasswordChecked] = useState(false);

    useEffect(() => {
        if (isLoggedIn)
            setElem(<Navigate to='/' />)
    }, [isLoggedIn]);

    useEffect(() => {
        if (password !== '' && passwordCheck !== '')
            setPasswordChecked(password === passwordCheck)
    }, [password,passwordCheck]);

    async function register() {
        if (!username || !email || !password || !passwordCheck) {
            showError(setElem, 'Bitte alle Felder ausfüllen!', 3000)
            return
        }
        if (!passwordChecked) {
            showError(setElem, 'Passwörter stimmen nicht über ein!', 3000)
            return
        }

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, email, password })
        }).catch((err: Error) => {
            console.log(err)
            showError(setElem, err.toString(), 5000)
        })
        if (!res)
            return;
        if (res.status === 201) {
            setElem(<Navigate to='/login' />)
        } else if (res.status === 409) {
            showError(setElem, 'Benutzername oder E-Mail bereits vergeben!', 3000)
        } else {
            console.log(res)
            showError(setElem, 'Error ' + res.status + ' ' + res.statusText, 5000)
        }
    }

    return (
        <div className={classNames(as.flexCol, ss.stepForm)}>
            <div className={classNames(as.flexCol, as.relative)}>
                <h2>Registrieren</h2>
                <div className={ss.gridSplit}>
                    <p style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername:</p>
                    <input
                        className={ss.inputBox}
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyDown={e => {
                            if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                        }}
                    />
                    <p style={{alignSelf: 'center', marginRight: '1em'}}>E-Mail:</p>
                    <input
                        className={ss.inputBox}
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => {
                            if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                        }}
                    />
                    <p style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</p>
                    <input
                        className={ss.inputBox}
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => {
                            if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                        }}
                    />
                    <p style={{alignSelf: 'center', marginRight: '1em'}}>Passwort Wiederholen:</p>
                    <input
                        className={ss.inputBox}
                        type='password'
                        value={passwordCheck}
                        onChange={e => setPasswordCheck(e.target.value)}
                        onKeyDown={e => {
                            if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                        }}
                    />
                </div>
                { elem }
            </div>
            <div className={ss.steps}>
                <button className={ss.nextStepButton} style={{float: 'right'}} onClick={() => register()}>{'Registrieren \u279C'}</button>
            </div>
        </div>
    )
}
