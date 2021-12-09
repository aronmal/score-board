import Nav from './Nav';

function Header() {
    return (
      <header className="Nav-header">
        <p id='top-banner'>This webpage is under construction and not finished yet!</p>
        <div id='top-header'>
          <p id='logo'>Score:Board</p>
          <Nav />
          <p id='time'>19:52</p>
        </div>
      </header>
    );
  }

export default Header;