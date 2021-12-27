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

    useEffect(() => {
        if (isLoggedIn) {
            setElem(<Navigate to='/' />)
        }
    }, [isLoggedIn]);

    async function register() {
        if (password === passwordCheck) {
            try {
                const postOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username: username, email: email, password: password})
                }
                await fetch('http://localhost:5000/api/register', postOptions)
                    .then(res => {
                        if (res.status === 201) setElem(<Navigate to='/login' />)
                    })
            } catch (err:any) {
                console.log(err)
                setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
                setTimeout(() => {
                    setElem(<></>)
                }, 5000)
            }
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
