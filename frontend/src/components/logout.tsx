import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import showError from '../helpers/showError';
import { loginContext }  from '../context';

export default function Logout() {

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
                showError(setElem, err.toString(), 5000)
            })
            if (!res)
                return;
            if (res.status === 200) {
                setIsLoggedIn(false)
                setElem(<Navigate to='/' />)
            } else {
                console.log(res)
                showError(setElem, 'Error ' + res.status + ' ' + res.statusText, 5000)
            }
        }
    }, [isLoggedIn, setIsLoggedIn])

        
    return elem
}
