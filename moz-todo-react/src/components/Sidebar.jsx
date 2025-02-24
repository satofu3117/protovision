// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li><Link to="/">Upload Protocol</Link></li>
        <li><Link to="/video">Video Manual</Link></li>
        <li><Link to="/archive">Archive</Link></li>
        <li><Link to="#">Settings</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;