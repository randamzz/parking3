import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Acc.css';

const AccUser = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('email');
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
          <li className="navbar-link"><Link className="nav-link" to="/OwnHisto">Own history</Link></li>
          <li className="navbar-link"><Link className="nav-link" to="/CurrentVec">Current List</Link></li>

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

export default AccUser;
