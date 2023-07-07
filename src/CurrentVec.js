import React from 'react';
import { vecEnCours, users } from './Data'; // Importer vecEnCours et users depuis Data.js
import './CurrentVec.css';

class CurrentVec extends React.Component {
  render() {
    const cap = 3;
    const garageFull = vecEnCours.length >= cap;
    const remainingSpots = cap - vecEnCours.length;

    return (
      <div className="current-vec-container">
        <h2>Current Vehicles</h2>
        <p className="description">Here are the vehicles in the garage at the moment</p>
        <table className="table">
          <thead>
            <tr>
              <th>User</th> 
              <th>License Plate</th>
              <th>Time In</th>
              <th>Time Out</th>
              
            </tr>
          </thead>
          <tbody>
            {vecEnCours.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{users.find((user) => user.id === vehicle.id_user)?.email}</td> {/* Affichage de l'email de l'utilisateur */}
                <td>{vehicle.licensePlate}</td>
                <td>{vehicle.timeIn}</td>
                <td>{vehicle.timeOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="summary">
          <p className="total-vehicles">
            <span className="car-emoji">&#128663;</span> Total in garage: {vecEnCours.length}
          </p>
          {garageFull ? (
            <p className="no-spots">
              <span role="img" aria-label="Désolé" className="sorry-emoji">😞</span>
              No more spots available
            </p>
          ) : (
            <p className="remaining-spots">
              <span role="img" aria-label="Alert Warning" className="warning-emoji">⚠️</span>
              {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} left
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default CurrentVec;
