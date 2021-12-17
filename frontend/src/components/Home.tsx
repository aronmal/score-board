import { useContext } from 'react';
import { Link } from 'react-router-dom'
import loginContext, { ContextType } from './Context';
import './Home.css';

function Home() {

  const { data, setData } = useContext(loginContext);

  function switchLogin() {
    setData((e: ContextType) => {
      let changeMe = e
      changeMe.login = !changeMe.login
      return changeMe})
  }

  return (
    <div className='flex-row'>
      <Link to={data.login ? '/new' : '/login'}
        onClick={() => {if (!data.login) switchLogin()}}
        >
        <div className='flex-row card'>
          <p>{data.login ? 'New' : 'Please Login'}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className='svg-symbol' d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
      </Link>
      <Link to='/code'>
        <div className='flex-row card'>
          <p>Use Code</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className='svg-symbol' d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
      </Link>
    </div> 
  );
}

export default Home;