import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function Logout() {

    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoggedIn(false)
        }
    }, [isLoggedIn, setIsLoggedIn])

    return <Navigate to='/' />
}

export default Logout
