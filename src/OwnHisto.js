import React from 'react';
import axios from 'axios';
import './OwnHisto.css';

class OwnHisto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myVecHisto: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/VecHisto')
      .then(response => {
        console.log(response.data);
        const { userId } = this.props;
        const myVecHisto = response.data.filter(vehicle => vehicle.id_user === userId);
        this.setState({ myVecHisto: myVecHisto });
      })
      .catch(error => {
        console.error(error);
      });
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
            {myVecHisto.map(vehicle => (
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
