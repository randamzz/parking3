import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Cud.css' ;
class Search extends React.Component {
  state = {
    vecEnCours: [],
    vecHistoFiltred: [],
    vecHisto: [],
    users: [],
    lp: '',
  };
  //Recup
  componentDidMount() {
    axios
      .get('http://localhost:5000/VecEnCours')
      .then((response) => {
        console.log(response.data);
        this.setState({ vecEnCours: response.data, vecHistoFiltred: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  
    axios
      .get('http://localhost:5000/VecHisto')
      .then((response) => {
        console.log(response.data);
        this.setState({ vecHisto: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  
    axios
      .get('http://localhost:5000/Users')
      .then((response) => {
        console.log(response.data);
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
//Rechreche
handleSearch = () => {
    const { vecHistoFiltred, lp } = this.state;
    const filteredVecHisto = vecHistoFiltred.filter((vehicle) =>
      vehicle.licensePlate.includes(lp)
    );
    this.setState({ vecHistoFiltred: filteredVecHisto });
  };
  
//Anule recherche
  handleClearSearch = () => {
    this.setState({ vecHistoFiltred: this.state.vecEnCours, lp: '' });
  };
//Deplacer de les elements qui ne sont plus dans garage au tab histo
  handleRefresh = () => {
    /*
    const { vecEnCours, vecHisto } = this.state;
    const currentTime = Date.now();
    const updatedVecEnCours = vecEnCours.filter((vehicle) => vehicle.timeOut > currentTime);
    const newVecHisto = vecEnCours.filter((vehicle) => vehicle.timeOut <= currentTime);
    this.setState({ vecEnCours: updatedVecEnCours, vecHisto: [...vecHisto, ...newVecHisto] });
    axios
      .put('http://localhost:5000/VecEnCours', updatedVecEnCours)
      .then((response) => {
        console.log('VecEnCours updated:', response.data);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
    axios
      .post('http://localhost:5000/VecHisto', newVecHisto)
      .then((response) => {
        console.log('VecHisto inserted:', response.data);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
    */};
  render() {
    const { lp, vecHistoFiltred } = this.state;
    const buttonColors = ['#462023', '#8f3636', '#c06f6c']; // Palette de couleurs pour les boutons
  
    return (
      <div className="container-fluid">
        <br />
        <center>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="License Plate"
                name="searchValue"
                value={lp}
                onChange={(e) => this.setState({ lp: e.target.value })}
              />
              <button className="button" onClick={this.handleSearch} style={{ backgroundColor: buttonColors[0] }}>
                <FontAwesomeIcon icon={faSearch} /> Search
              </button>
              <button className="button" onClick={this.handleClearSearch} style={{ backgroundColor: buttonColors[1] }}>
                <FontAwesomeIcon icon={faTimes} /> Clear
              </button>
              <button className="button" onClick={this.handleRefresh} style={{ backgroundColor: buttonColors[2] }}>
                <FontAwesomeIcon icon={faSyncAlt} /> Refresh
              </button>
            </div>
          </div>
        </div>
        </center>
        <div className="row">
          <div className="col-md-12">
            {vecHistoFiltred.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-full-width">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>License Plate</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vecHistoFiltred.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{this.state.users.find((user) => user.id === vehicle.id_user)?.email}</td>
                        <td>{vehicle.licensePlate}</td>
                        <td>{vehicle.timeIn}</td>
                        <td>{vehicle.timeOut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Search;
