import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Test from './components/Test';
import New from './components/New';

function App() {
  return (
    <BrowserRouter>
      <div className='content flex-col'>
        <Header />
        <div className='content-div flex-col'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/test' element={<Test />} />
            <Route path='/new' element={<New />} />
          </Routes>
        </div>
        <Footer /> 
      </div>
    </BrowserRouter>
  );
}

export default App;
