import {Link} from 'react-router-dom'

function Nav() {
    return (
      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/test' className='active'>Test</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
      </nav>
    );
  }

export default Nav;