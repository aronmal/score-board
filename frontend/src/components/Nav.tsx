import { Link } from 'react-router-dom'

function Nav() {
  return (
    <div id="nav" className='flex-row'>
      <Link className='navlink active' to='/'><p>Home</p></Link>
      <Link className='navlink' to='/test'><p>Test</p></Link>
      <Link className='navlink' to='/login'><p>Login</p></Link>
    </div>
  );
}

export default Nav;