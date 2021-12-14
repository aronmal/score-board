import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom'

function Header() {
  
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    setInterval(() => {
      setTime(() => Clock('hh:mm'))
    }, 1000);
  }, []);

  return (
    <header className="Nav-header">
      <p id='top-banner'>This webpage is under construction and is not finished yet!</p>
      <div id='top-header'>
        <Link className="flex-row" to='/'>
          <img id='logo-icon' src="/images/logo192.png" alt="logo" />
          <p id='logo'>Score:Board</p>
        </Link>
        <Nav />
        <p id='time'> {time} </p>
      </div>
    </header>
  );
}

function Clock(type: string) {
    
  // clock function

  var h = new Date().getHours();
  var m = new Date().getMinutes();
  var s = new Date().getSeconds();

  var hh = h < 10 ? "0" + h : h;
  var mm = m < 10 ? "0" + m : m;
  var ss = s < 10 ? "0" + s : s;

  switch(type) {
    case'h':
      return `${h}`
    case'm':
      return `${m}`
    case's':
      return `${s}`
    case'hh':
      return `${hh}`
    case'mm':
      return `${mm}`
    case'ss':
      return `${ss}`
    case'hh:mm':
      return `${hh}:${mm}`
    default:
      return `${hh}:${mm}:${ss}`
  };

};

function Nav() {

  const [ isloggedin, setIsloggedin ] = useState(false)
  const location = useLocation();
  const loginElem = <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg><p>Login</p></>
  const logoutElem = <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M13 2v-2l10 3v18l-10 3v-2h-9v-7h1v6h8v-18h-8v7h-1v-8h9zm-2.947 10l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z"/></svg><p>Logout</p></>

  function switchLogin() {
    setIsloggedin(e => !e)
  }

  return (
    <nav id="nav" className='flex-row'>
      <Link className={`navlink ${(location.pathname === '/') ? 'active' : ''}`} to='/'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z"/></svg><p>Home</p></Link>
      <Link className='navlink' to='/test'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path className='svg-navlink' d="M17 10.645v-2.29c-1.17-.417-1.907-.533-2.28-1.431-.373-.9.07-1.512.6-2.625l-1.618-1.619c-1.105.525-1.723.974-2.626.6-.9-.373-1.017-1.116-1.431-2.28h-2.29c-.412 1.158-.53 1.907-1.431 2.28h-.001c-.9.374-1.51-.07-2.625-.6l-1.617 1.619c.527 1.11.973 1.724.6 2.625-.375.901-1.123 1.019-2.281 1.431v2.289c1.155.412 1.907.531 2.28 1.431.376.908-.081 1.534-.6 2.625l1.618 1.619c1.107-.525 1.724-.974 2.625-.6h.001c.9.373 1.018 1.118 1.431 2.28h2.289c.412-1.158.53-1.905 1.437-2.282h.001c.894-.372 1.501.071 2.619.602l1.618-1.619c-.525-1.107-.974-1.723-.601-2.625.374-.899 1.126-1.019 2.282-1.43zm-8.5 1.689c-1.564 0-2.833-1.269-2.833-2.834s1.269-2.834 2.833-2.834 2.833 1.269 2.833 2.834-1.269 2.834-2.833 2.834zm15.5 4.205v-1.077c-.55-.196-.897-.251-1.073-.673-.176-.424.033-.711.282-1.236l-.762-.762c-.52.248-.811.458-1.235.283-.424-.175-.479-.525-.674-1.073h-1.076c-.194.545-.25.897-.674 1.073-.424.176-.711-.033-1.235-.283l-.762.762c.248.523.458.812.282 1.236-.176.424-.528.479-1.073.673v1.077c.544.193.897.25 1.073.673.177.427-.038.722-.282 1.236l.762.762c.521-.248.812-.458 1.235-.283.424.175.479.526.674 1.073h1.076c.194-.545.25-.897.676-1.074h.001c.421-.175.706.034 1.232.284l.762-.762c-.247-.521-.458-.812-.282-1.235s.529-.481 1.073-.674zm-4 .794c-.736 0-1.333-.597-1.333-1.333s.597-1.333 1.333-1.333 1.333.597 1.333 1.333-.597 1.333-1.333 1.333zm-4 3.071v-.808c-.412-.147-.673-.188-.805-.505s.024-.533.212-.927l-.572-.571c-.389.186-.607.344-.926.212s-.359-.394-.506-.805h-.807c-.146.409-.188.673-.506.805-.317.132-.533-.024-.926-.212l-.572.571c.187.393.344.609.212.927-.132.318-.396.359-.805.505v.808c.408.145.673.188.805.505.133.32-.028.542-.212.927l.572.571c.39-.186.608-.344.926-.212.318.132.359.395.506.805h.807c.146-.409.188-.673.507-.805h.001c.315-.131.529.025.924.213l.572-.571c-.186-.391-.344-.609-.212-.927s.397-.361.805-.506zm-3 .596c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1-.448 1-1 1z"/></svg><p>Test</p></Link>
      <Link className='navlink' to={ !isloggedin ? '/login' : '/logout' } onClick={() => switchLogin()}> { !isloggedin ? loginElem : logoutElem } </Link>
    </nav>
  );
}

export default Header;