import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Acc.css';
const AccAdmin = ({ children ,handleLogout }) => {

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout(); 
    navigate('/login');       
                                  };
  const cookieValue = Cookies.get('email');
  return (
  <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#462023' }}>
       <div className="container">
       <Link className="navbar-brand" to="/">
        STM Garage Track
       </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
      <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
          <Link className="nav-link" to="/Cud">
            Garage Management
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Search">
              Search
              </Link>
            </li>

          <li className="nav-item">
            <Link className="nav-link" to="/CurrentVec">
              Current List
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/UserProfile">
              {cookieValue ? cookieValue : ''}
            </Link>
          </li>
          <li className="nav-item">
            <button className="btn btn-secondary" onClick={handleLogoutClick}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  {children}
</div>
  );
};

export default AccAdmin;
