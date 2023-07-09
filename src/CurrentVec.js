import React from 'react';
import './CurrentVec.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
class CurrentVec extends React.Component {
state ={ vecEnCours :[] , users:[] }
componentDidMount() {
  axios.get('http://localhost:5000/VecEnCours')
    .then(response => {
      console.log(response.data);
      this.setState({ vecEnCours: response.data });
    })
    .catch(error => {
      console.error(error);
    });

  axios.get('http://localhost:5000/Users')
    .then(response => {
      console.log(response.data);
      this.setState({ users: response.data });
    })
    .catch(error => {
      console.error(error);
    });
}
render() {
  const cap = 3; // Normalment 500
  const garageFull = this.state.vecEnCours.length >= cap;
  const remainingSpots = cap - this.state.vecEnCours.length;
  return (
    <div className="current-vec-container">
      <h2>Current Vehicles</h2>
      <p className="description">Here are the vehicles in the garage at the moment</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User</th>
            <th>License Plate</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {this.state.vecEnCours.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{this.state.users.find((user) => user.id === vehicle.id_user)?.email}</td>
              <td>{vehicle.licensePlate}</td>
              <td>{vehicle.timeIn}</td>
              <td>{vehicle.timeOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="summary">
        <p className="total-vehicles">
          <span className="car-emoji">&#128663;</span> Total in garage: {this.state.vecEnCours.length}
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
