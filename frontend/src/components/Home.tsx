import { Link } from 'react-router-dom'
import Header from './Header';
import Footer from './Footer';

function Home() {
  return (
    <>
      <div className='content flex-col'>
        <Header />
        <div className='content-div flex-col'>
          <div className='flex-row'>
            <Link to='/new'>
              <div className='flex-row card'>
                <p>New</p>
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
        </div>
        <Footer /> 
      </div> 
    </>
  );
}

export default Home;