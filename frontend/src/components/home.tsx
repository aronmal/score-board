import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { loginContext }  from '../context';
import { appStyleType } from '../interfaces';
import appStyle from '../styles/app.module.css';
const as = appStyle as appStyleType;

export default function Home() {

  const { isLoggedIn } = useContext(loginContext);

  return (
    <div className='flex-row-justify'>
      <Link className={as.cardA} to={isLoggedIn ? '/newgroup' : '/login'}>
        <div className={`flex-row-justify ${as.card}`}>
          <p>{isLoggedIn ? 'New' : 'Please Login'}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
      </Link>
      <Link className={as.cardA} to='/code'>
        <div className={`flex-row-justify ${as.card}`}>
          <p>Use Code</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
      </Link>
    </div> 
  );
}