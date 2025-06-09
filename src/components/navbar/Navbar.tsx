// src/components/navbar/Navbar.tsx
/*
Author: Wanda Azhar
Location: Twin Falls, ID, USA
Contact: wandaazhar@gmail.com
Description: The main navigation bar for the application.
*/

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import './navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FontAwesomeIcon icon={faTasks} />
          Task Tracker
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;