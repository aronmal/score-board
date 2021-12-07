import React from 'react';
import './main.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Test from './components/Test';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/test' element={<Test />} />
          <Route path='/second' element={<Test />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
