import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function Login() {

    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [elem, setElem] = useState(<></>);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            setElem(<Navigate to='/' />)
        }
    }, [isLoggedIn]);

    async function Login() {
        const postOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: username, password: password })
        }
        let response: any
        await fetch('http://localhost:5000/api/get', postOptions)
            .then(res => res.json())
            .then(data => response = data)
            .catch(err => console.log(err))
        if (response.status === 'success') {
            setIsLoggedIn(true)
        } else {
            console.log(response)
            setElem(<p style={{color: 'red'}}>Benutzer nicht gefunden!</p>)
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
                <label style={{alignSelf: 'center', marginRight: '1em'}}>Passwort:</label>
                <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button onClick={() => Login()}>Login</button>
            {elem}
        </>
    )
}

export default Login
