import {BrowserRouter, Routes, Route} from 'react-router-dom';
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
    </BrowserRouter>
  );
}

export default App;
