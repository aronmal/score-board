import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function LoginOut() {

    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [elem, setElem] = useState(<></>);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function Login() {
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        }
        await fetch('http://localhost:5000/api/post', postOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
        setIsLoggedIn(true)

        setElem(<Navigate to='/' />)
    }
    function Logout() {
        setIsLoggedIn(false)

        setElem(<Navigate to='/' />)
    }

    if (!isLoggedIn) {
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
                <button className='add-player-button' onClick={() => Login()}>Login</button>
                {elem}
            </>
    )} else {
        return (
            <>
                <button className='add-player-button' onClick={() => Logout()}>Logout</button>
                {elem}
            </>
    )}
}

export default LoginOut
