import { Link } from 'react-router-dom'

function New() {
  return (
    <div className='flex-row'>
      <Link to='/'>
        <div className='flex-row card'>
          <p>Back to Home</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path className='svg-symbol' d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
      </Link>
    </div> 
  );
}

export default New;