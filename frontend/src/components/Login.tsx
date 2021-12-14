import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Login() {

    const [elem, setElem] = useState(<p>You are now logged in!</p>)

    useEffect(() => {
        setTimeout(() => {
            setElem(<Navigate to='/' />)
        }, 2000);
    }, []);

    return (
        <div>
            {elem}
        </div>
    )
}

export default Login
