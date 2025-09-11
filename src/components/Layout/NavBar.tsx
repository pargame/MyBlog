import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/styles.css';

export default function NavBar() {
  return (
    <nav className="site-nav">
      <div className="nav-container">
        <Link to="/" className="brand">
          Home
        </Link>
        <div className="links">
          <Link to="/graphs">Graphs</Link>
        </div>
      </div>
    </nav>
  );
}
