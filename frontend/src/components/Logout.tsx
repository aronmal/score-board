import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function Logout() {

    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [elem, setElem] = useState(<></>);

    useEffect(() => {
        logout()

        async function logout() {
            if (!isLoggedIn)
                setElem(<Navigate to='/' />);
            const res: void | Response = await fetch('/api/logout', {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
            }).catch((err: Error) => {
                console.log(err)
                setElem(<p style={{color: 'red'}}>{ err.toString() }</p>)
                setTimeout(() => {
                    setElem(<></>)
                }, 5000)
            })
            if (!res)
                return;
            if (res.status === 200) {
                setIsLoggedIn(false)
                setElem(<Navigate to='/' />)
            } else {
                console.log(res)
                setElem(<p style={{color: 'red'}}>{ 'Error ' + res.status + ' ' + res.statusText }</p>)
                setTimeout(() => {
                    setElem(<></>)
                }, 5000)
            }
        }
    }, [isLoggedIn, setIsLoggedIn])

        
    return elem
}

export default Logout
