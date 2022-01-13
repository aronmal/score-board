import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function Register() {
    
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
        if (!passwordChecked) {
            setElem(<p style={{color: 'red'}}>Passwörter stimmen nicht über ein!</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 3000)
            return
        }

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': username, 'email': email, 'password': password})
        }).catch((err: Error) => {
            console.log(err)
            setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 5000)
        })
        if (!res)
            return;
        if (res.status === 201) {
            setElem(<Navigate to='/login' />)
        } else if (res.status === 409) {
            setElem(<p style={{color: 'red'}}>Benutzername oder E-Mail bereits vergeben!</p>)
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
        <div className='flex-col step-form'>
            <h2>Registrieren</h2>
            <div className='grid-2-col'>
                <p style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername:</p>
                <input
                    className='input-box'
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => {
                        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
                <p style={{alignSelf: 'center', marginRight: '1em'}}>E-Mail:</p>
                <input
                    className='input-box'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => {
                        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
                <p style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</p>
                <input
                    className='input-box'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => {
                        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
                <p style={{alignSelf: 'center', marginRight: '1em'}}>Passwort Wiederholen:</p>
                <input
                    className='input-box'
                    type='password'
                    value={passwordCheck}
                    onChange={e => setPasswordCheck(e.target.value)}
                    onKeyDown={e => {
                        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
            </div>
            <div className='steps'>
                <button className='next-step-button' style={{float: 'right'}} onClick={() => register()}>{'Registrieren \u279C'}</button>
            </div>
            { elem }
        </div>
    )
}

export default Register
