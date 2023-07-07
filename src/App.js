import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AccUser from './AccUser';
import CurrentVec from './CurrentVec';
import Cookies from 'js-cookie';
import OwnHisto from './OwnHisto';
import Gestion from './Gestion';
import AccAdmin from './AccAdmin';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import UserProfile from './UserProfile' ;
import Search from './Search';


import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
}
from 'mdb-react-ui-kit';
// Vérifier l'e-mail
function checkEmail(email, users) {
  let ok = false;
  for (let i = 0; i < users.length; i++) {
    if (email === users[i].email) {
      ok = true;
      break;
    }
  }
  return ok;
}
/*
// Vérifier le mot de passe
function checkPassword(email, users, password) {
  const ok = checkEmail(email, users);
  if (ok) {
    const user = users.find(user => user.email === email);
    if (user.password === password) {
      return true;
    } else {
      return false;
    }
  }
}
*/
// Deplacer de current a historique
function Deplacer(vecEnCours, vecHisto) {
  for (let i = 0; i < vecEnCours.length; i++) {
    const timeOut = new Date(vecEnCours[i].timeOut);
    if (timeOut < Date.now()) {
      vecHisto.push(vecEnCours[i]);
    }
  }
  return vecHisto;
}

function App() {
const [users, setusers] = useState([]);
 //Charger les donnes de json server 
useEffect(() => {
      fetch('http://localhost:8000/Users')
      .then(response => response.json())
      .then(jsonData => setusers(jsonData));
  }, []);
// deplacer vecHisto=Deplacer(vecEnCours,vecHisto)  ;
  const [loggedInUser, setLoggedInUser] = useState(null); // au deb user n est pas connecter
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // fct de cnx
    const handleLogin = () => {
    const emailExists = checkEmail(email, users);
    if (!emailExists) {
      window.alert("Email does not exist ");
    } else {
      const user = users.find(user => user.email === email);
      const passwordCorrect = user.password === password;
      
      if (passwordCorrect) {
        setLoggedInUser(user);
        Cookies.set('email', user.email);

      } else {
        window.alert("Incorrect password");
      }
    }
  };
//logout 
const handleLogout = () => {
  Cookies.remove('email');
  setLoggedInUser(null);
};
  // Si il n est pas connecter
  if (!loggedInUser) {
    // Aff  page  connexion (formulaire)
    return (
     <MDBContainer fluid>
     <MDBRow className='d-flex justify-content-center align-items-center h-100'>
       <MDBCol col='12'>
         <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
           <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
             <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
             <p className="text-white-50 mb-5">Please enter your login and password!</p>
            <MDBInput wrapperClass="mb-4 mx-5 w-100" type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} size="lg" />
             <MDBInput wrapperClass='mb-4 mx-5 w-100' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} size="lg"/>
             <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
             <Button onClick={handleLogin}  variant="secondary"><span role="img" aria-label="Se connecter" className="login-emoji">🔑</span>Login </Button>{' '}
             <div>
              <br></br>
              <p className="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up </a></p>
             </div>
           </MDBCardBody>
         </MDBCard>
       </MDBCol>
     </MDBRow>
   </MDBContainer>
    );
  } else {
    const { id, email, type } = loggedInUser; // /prendre les val user au lieu d utulise user.id !!DESTRUCTRING //          <Button onClick={handleLogout}  variant="secondary">Logout</Button>{' '}
    const cookieValue = Cookies.get('email');
    // espace admin
    if (type === 1) {
      return (
        <div>
          { <div className="App">
          <BrowserRouter>
          <AccAdmin handleLogout={handleLogout} email={cookieValue} />
            <Routes>
            <Route path="/UserProfile" element={<UserProfile email={cookieValue}/>} />
            <Route path="/CurrentVec"element={<CurrentVec />}/>
            <Route path="/Search" element={<Search />} />
            <Route path="/Gestion" element={<Gestion />} />
            </Routes>
          </BrowserRouter>
        </div>}
        </div>
      );  
    } else { 
      // espace utilisateur
      return (
        <div>
          { <div className="App">
          <BrowserRouter>
            <AccUser loggedInUser={loggedInUser} email={cookieValue} />
            <Routes>
            <Route path="/UserProfile" element={<UserProfile email={cookieValue}/>} />
            <Route path="/CurrentVec"element={<CurrentVec  />}/>
            <Route path="/OwnHisto" element={<OwnHisto userId={id} />} />
            </Routes>
          </BrowserRouter>
        </div>
        }
        </div>
      );
    }
  }
}

export default App;

