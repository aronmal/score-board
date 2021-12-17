import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import LoginOut from './components/LoginOut';
import Test from './components/Test';
import New from './components/New';
import loginContext, { ContextType } from './components/Context';
import { useState, useMemo } from 'react';
import './App.css';

function App() {

  const [login, setLogin] = useState<ContextType>({ login: false })
  const value = useMemo(() => ({ data: login, setData: setLogin }), [login, setLogin])

  return (
    <BrowserRouter>
      <loginContext.Provider value={value}>
        <div className='content flex-col'>
          <Header />
          <div className='content-div flex-col'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<LoginOut />} />
              <Route path='/logout' element={<LoginOut />} />
              <Route path='/test' element={<Test />} />
              <Route path='/new' element={<New />} />
            </Routes>
          </div>
          <Footer /> 
        </div>
      </loginContext.Provider>
    </BrowserRouter>
  );
}

export default App;
