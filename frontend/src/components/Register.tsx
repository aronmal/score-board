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

        await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': username, 'email': email, 'password': password})
        }).then((res: Response) => {
            if (res.status === 201)
                setElem(<Navigate to='/login' />)
        }).catch((err: Error) => {
            console.log(err)
            setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 5000)
        })
    }

    return (
        <>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername:</label>
                <input
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => {
                      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
            </div>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>E-Mail:</label>
                <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => {
                      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
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
                      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
            </div>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Passwort Wiederholen:</label>
                <input
                    type='password'
                    value={passwordCheck}
                    onChange={e => setPasswordCheck(e.target.value)}
                    onKeyDown={e => {
                      if ((e.code === 'Enter' || e.code === 'NumpadEnter') && (username !== '' && password !== '')) register()
                    }}
                />
            </div>
            <button onClick={() => register()}>Registrieren</button>
            {elem}
        </>
    )
}

export default Register
