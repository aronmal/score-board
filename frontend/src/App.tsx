import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Newgroup from './components/Newgroup/Newgroup';
import loginContext from './components/Context';
import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { loginCheck } from './components/Helpers';

function App() {

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

export default App;
