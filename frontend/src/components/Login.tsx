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

    async function login() {
        try {
            const getOptions = {
                method: 'GET',
                headers: {'content-type': 'application/json', 'username': username, 'password': password},
            }
            await fetch('http://localhost:5000/api/login', getOptions)
                .then(async (res: any) => {
                    if (res.status === 200) {
                        const response = await res.json()
                        console.log(response.data)
                        setIsLoggedIn(true)
                    } else if (res.status === 401) {
                        setElem(<p style={{color: 'red'}}>Benutzername oder Passwort ungültig!</p>)
                        setTimeout(() => {
                            setElem(<></>)
                        }, 3000)
                    } else {
                        setElem(<p style={{color: 'red'}}>Unbekannter Fehler</p>)
                        setTimeout(() => {
                            setElem(<></>)
                        }, 5000)
                    }
                })
        } catch (err:any) {
            console.log(err)
            setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
            setTimeout(() => {
                setElem(<></>)
            }, 5000)
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
            <button onClick={() => Login()}>Login</button>
            {elem}
        </>
    )
}

export default Login
