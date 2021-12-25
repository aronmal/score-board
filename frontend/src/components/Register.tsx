import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function Register() {
    
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [elem, setElem] = useState(<></>);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            setElem(<Navigate to='/' />)
        }
    }, [isLoggedIn]);

    async function register() {
        const postOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, email: email, password: password})
        }
        if (password === passwordCheck) {
            await fetch('http://localhost:5000/api/post', postOptions)
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.log(err))
            setIsLoggedIn(true)
            setElem(<Navigate to='/login' />)
        } else {
            setElem(<p style={{color: 'red'}}>Passwörter stimmen nicht über ein!</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 3000)
        }
    }

    return (
        <>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Nutzername:</label>
                <input
                    type='text'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>E-Mail:</label>
                <input
                    type='email'
                    placeholder='(optional)'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</label>
                <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className='flex-row'>
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Passwort Wiederholen:</label>
                <input
                    type='password'
                    value={passwordCheck}
                    onChange={e => setPasswordCheck(e.target.value)}
                />
            </div>
            <button onClick={() => register()}>Registrieren</button>
            {elem}
        </>
    )
}

export default Register
