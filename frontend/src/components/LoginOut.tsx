import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import loginContext from './Context';

function LoginOut() {

    const { data } = useContext(loginContext);
    const [elem, setElem] = useState(<p>{data.login ? 'You are now logged in!' : 'You are now logged out!'}</p>)

    setTimeout(() => {
        setElem(<Navigate to='/' />)
    }, 2000);

    return (
        <div>
            {elem}
        </div>
    )
}

export default LoginOut
