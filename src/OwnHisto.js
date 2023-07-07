import React from 'react';
import './OwnHisto.css'; 
import { vecHisto } from './Data';
class OwnHisto extends React.Component {
  constructor(props) {
    super(props);
    const { userId } = props;
    // Prendre l'historique de ce user
    const myVecHisto = vecHisto.filter((vehicle) => vehicle.id_user === userId);
    // State
    this.state = {
      myVecHisto: myVecHisto,
    };
  }

  render() {
    const { myVecHisto } = this.state;

    return (
      <div className="own-histo-container">
        <h2>Your History</h2>
        <p className="description">Here are the vehicles in your history.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Time In</th>
              <th>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {myVecHisto.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.timeIn}</td>
                <td>{vehicle.timeOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OwnHisto;
