import { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'
import clock from '../helpers/clock';
import { loginContext }  from './context';

export default function Header() {
  
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    setInterval(() => {
      setTime(() => clock())
    }, 1000);
  }, []);

  return (
    <header>
      <p id='top-banner'>This webpage is under construction and is not finished yet!</p>
      <div id='top-header'>
        <Link className='flex-row logo-a' to='/'>
          <img id='logo-icon' src="/images/logo192.png" alt="logo" />
          <p id='logo'>Score:Board</p>
        </Link>
        <Nav />
        <p id='time'>{time}</p>
      </div>
    </header>
  );
}

function Nav() {

  const { isLoggedIn } = useContext(loginContext);

  const location = useLocation();    
  const registerElem = <><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className='svg-navlink' d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg><p>Registrieren</p></>
  const dashboardElem = <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M24 24h-24v-24h24v24zm-2-22h-20v20h20v-20zm-4.118 14.064c-2.293-.529-4.427-.993-3.394-2.945 3.146-5.942.834-9.119-2.488-9.119-3.388 0-5.643 3.299-2.488 9.119 1.064 1.963-1.15 2.427-3.394 2.945-2.048.473-2.124 1.49-2.118 3.269l.004.667h15.993l.003-.646c.007-1.792-.062-2.815-2.118-3.29z"/></svg><p>Dashboard</p></>
  const loginElem = <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg><p>Login</p></>
  const logoutElem = <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M13 2v-2l10 3v18l-10 3v-2h-9v-7h1v6h8v-18h-8v7h-1v-8h9zm-2.947 10l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z"/></svg><p>Logout</p></>

  return (
    <nav id="nav" className='flex-row'>
      <Link className={`navlink ${(location.pathname === '/') ? 'active' : ''}`} to='/'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z"/></svg><p>Home</p></Link>
      <Link className={`navlink ${(location.pathname === '/register' && !isLoggedIn) ? 'active' : ''} ${(location.pathname === '/dashboard' && isLoggedIn) ? 'active' : ''}`} to={ !isLoggedIn ? '/register' : '/dashboard' }>{ !isLoggedIn ? registerElem : dashboardElem }</Link>
      <Link className={`navlink ${(location.pathname === '/login') ? 'active' : ''}`} to={ !isLoggedIn ? '/login' : '/logout' }>{ !isLoggedIn ? loginElem : logoutElem }</Link>
    </nav>
  );
}