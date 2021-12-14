import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Logout() {

    const [elem, setElem] = useState(<p>You are now logged out!</p>)

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

export default Logout
