import { useState, useEffect } from "react";
import Nav from './Nav';
import clock from "./Clock";

function Header() {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    setInterval(() => {
      setTime(() => clock());
    }, 1000);
  });

  return (
    <header className="Nav-header">
      <p id='top-banner'>This webpage is under construction and is not finished yet!</p>
      <div id='top-header'>
        <p id='logo'>Score:Board</p>
        <Nav />
        <p id='time'> {time} </p>
      </div>
    </header>
  );
}

export default Header;