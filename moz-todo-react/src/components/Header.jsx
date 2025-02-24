import React from 'react';
import './Header.css';
import logo from '../assets/protovision.png';

const Header = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="header">
      <img src={logo} alt="Protovision" className="logo" />
      <div className="theme-toggle">
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>
    </header>
  );
};

export default Header;