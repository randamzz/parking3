import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Acc.css';
import App from './App';

const AccAdmin = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
   Cookies.remove('cookieValue');
    setLoggedInUser(false);
    navigate('/');
  };

  const cookieValue = Cookies.get('email');

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="user-email">STM Garage Track</span>
        </div>
        <ul className="navbar-links">
          <li className="navbar-link"><Link className="nav-link" to="/Gestion">Garage Management</Link></li>
          <li className="navbar-link"><Link className="nav-link" to="/CurrentVec">Current List</Link></li>
          <li className="navbar-link"><Link className="nav-link" to="/Search">Search</Link></li>
        </ul>
        <div className="navbar-right">
          <div className="user-info">
            <FontAwesomeIcon icon={faUser} className="user-icon" />
            <li className="navbar-link">  <Link className="user-email" to="/UserProfile">{cookieValue ? cookieValue : ''}</Link></li>
          </div>
          <Button className="logout-button" onClick={handleLogout} variant="secondary">Logout</Button>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default AccAdmin;
