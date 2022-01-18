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

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [elem, setElem] = useState(<></>)
  const loginContextProviderValue = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn, setIsLoggedIn])

  useEffect(() => {
    loginCheck()
  }, [])

  async function loginCheck() {
    const res: void | Response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'loginCheck' }),
    }).catch((err: Error) => console.log(err))
    if (!res)
      return;
    let loginCheck = false;
    try {
      const body = await res.json()
      loginCheck = body.loggedIn
      console.log('loginCheck: ' + loginCheck)
    } catch (err: any) {
      console.log(err)
    }
    if (res.status === 200 && loginCheck) {
      setIsLoggedIn(true)
    }
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
