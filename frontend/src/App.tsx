import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer';
import Home from './components/Home';
import Test from './components/Test';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/test' element={<Test />} />
        <Route path='/second' element={<Test />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
