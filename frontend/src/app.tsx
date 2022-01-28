import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './components/home';
import Dashboard from './components/dashboard';
import Register from './components/register';
import Login from './components/login';
import Logout from './components/logout';
import Newgroup from './components/newgroup/newgroup';
import { useState, useEffect, useMemo } from 'react';
import './app.css';
import loginCheck from './helpers/loginCheck';
import { loginContext } from './components/context';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [elem, setElem] = useState(<></>)
  const loginContextProviderValue = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn, setIsLoggedIn])

  useEffect(() => {
    login()
  }, [])

  async function login() {
    const check = await loginCheck()
    
    if (check)
      setIsLoggedIn(true)

    setElem(
      <div className='content-div flex-col'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/newgroup' element={<Newgroup />} />
        </Routes>
      </div>
    )
  }
  
  return (
    <BrowserRouter>
      <loginContext.Provider value={loginContextProviderValue}>
        <div className='content flex-col'>
          <Header />
            { elem }
          <Footer /> 
        </div>
      </loginContext.Provider>
    </BrowserRouter>
  );
}
