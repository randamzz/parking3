import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Gestion.css';

class Gestion extends React.Component {
  state = {
    vecHistoImported: [],
    users: [],
    vecHistoUpdated: [],
    showAddForm: false,
    showEditForm: false,
    editedVehicle: null,
    licensePlate: '',
    timeIn: '',
    timeOut: '',
    lp: ''
  };

  componentDidMount() {
    axios
      .get('http://localhost:8000/VecHisto')
      .then((response) => {
        console.log(response.data);
        this.setState({ vecHistoImported: response.data, vecHistoUpdated: response.data });
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8000/Users')
      .then((response) => {
        console.log(response.data);
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleUpdate = (id) => {
    const { vecHistoUpdated, licensePlate, timeIn, timeOut } = this.state;
/*
    const parsedTimeIn = Date.parse(timeIn);
    const parsedTimeOut = Date.parse(timeOut);
    const currentTime = Date.now();

    if (parsedTimeIn > currentTime || parsedTimeOut > currentTime) {
      alert('Please choose a correct time entry');
      return;
    }
    if (parsedTimeIn >= parsedTimeOut) {
      alert('Time In must be earlier than Time Out');
      return;
    }
*/
    const updatedVecHisto = vecHistoUpdated.map((vehicle) => {
      if (vehicle.id === id) {
        return {
          ...vehicle,
          licensePlate: licensePlate,
          timeIn: timeIn,
          timeOut: timeOut,
        };
      }
      return vehicle;
    });

    axios
      .put(`http://localhost:8000/VecHisto/${id}`, {
        licensePlate: licensePlate,
        timeIn: timeIn,
        timeOut: timeOut,
      })
      .then((response) => {
        console.log('Data updated:', response.data);
        this.setState({ vecHistoUpdated: updatedVecHisto });
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };
// Sup vec
  handleDeleteVehicle = (vehicleId) => {
    const updatedVecHisto = this.state.vecHistoUpdated.filter((vehicle) => vehicle.id !== vehicleId);
    this.setState({ vecHistoUpdated: updatedVecHisto });
    axios.delete('http://localhost:8000/VecHisto/'+ vehicleId)
    .then(response => {console.log('vehicle deleted'); })
    .catch(error => {
    console.error(' erreur' , error);
  });
  };

  handleAddButtonClick = () => {
    this.setState({ showAddForm: true });
  };

  handleEditButtonClick = (vehicleId) => {
    const vehicle = this.state.vecHistoUpdated.find((v) => v.id === vehicleId);
    if (vehicle) {
      this.setState({
        showEditForm: true,
        editedVehicle: vehicle,
        licensePlate: vehicle.licensePlate,
        timeIn: vehicle.timeIn,
        timeOut: vehicle.timeOut,
      });
    }
  };

  handleCancelAdd = () => {
    this.setState({ showAddForm: false });
  };

  handleCancelEdit = () => {
    this.setState({ showEditForm: false, editedVehicle: null });
  };

  handleAddVehicle = () => {
    const { licensePlate, timeIn, timeOut, vecHistoUpdated } = this.state;
    if (!licensePlate || !timeIn) {// Si les champs ne sont pas remplit
      alert('Please fill in both License Plate and Time In fields.');
      return;
    }
    // cast timeIn / verifier que uadmin a choisit t>de db
    const parsedTimeIn = Date.parse(timeIn);
    if (isNaN(parsedTimeIn)) {
      alert('Invalid Time In format');
      return;
    }
    const timeInDate = new Date(parsedTimeIn);
    if (timeInDate < Date.now()) {
      alert('Please choose a correct time entry');
      return;
    }// new entry
    const newVehicle = {
      id: vecHistoUpdated.id + 1,
      licensePlate,
      timeIn,
      timeOut,
    };
    axios.post('http://localhost:8000/VecHisto', newVehicle)
      .then(response => {
        console.log('Vehicle inserted', response.data);
        // Mettre à jour l'état avec les nouvelles données
        this.setState(prevState => ({
          vecHistoUpdated: [...prevState.vecHistoUpdated, newVehicle]
        }));
      })
      .catch(error => {
        console.error(' erreur ', error);
      });
  };
  render() {
    const { vecHistoUpdated, users, showAddForm, showEditForm, editedVehicle, licensePlate, timeIn, timeOut } =
      this.state;

    return (
      <div className="table-container">
        <center>
          <h2>Management</h2>
          <p className="description">Here you can manage your website.</p>
        </center>

        <div className="button-container">
          <button className="button add-button" onClick={this.handleAddButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Vehicle
          </button>
        </div>

        {showEditForm && editedVehicle && (
          <div className="form-container">
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => this.setState({ licensePlate: e.target.value })}
            />
            <input
              type="datetime-local"
              value={timeIn}
              onChange={(e) => this.setState({ timeIn: e.target.value })}
            />
            <input
              type="datetime-local"
              value={timeOut}
              onChange={(e) => this.setState({ timeOut: e.target.value })}
            />
            <button className="button" onClick={() => this.handleUpdate(editedVehicle.id)}>
              Save
            </button>
            <button className="button" onClick={this.handleCancelEdit}>
              Cancel
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="form-container">
            <input
              type="text"
              placeholder="License Plate"
              value={licensePlate}
              onChange={(e) => this.setState({ licensePlate: e.target.value })}
            />
            <input
              type="datetime-local"
              placeholder="Time In"
              value={timeIn}
              onChange={(e) => this.setState({ timeIn: e.target.value })}
            />
            <input
              type="datetime-local"
              placeholder="Time Out"
              value={timeOut}
              onChange={(e) => this.setState({ timeOut: e.target.value })}
            />
            <button className="button" onClick={this.handleAddVehicle}>
              <FontAwesomeIcon icon={faPlus} /> Add
            </button>
            <button className="button"
onClick={this.handleCancelAdd}>
              Cancel
            </button>
          </div>
        )}

        {vecHistoUpdated.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>License Plate</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {vecHistoUpdated.map((vehicle) => {
                const user = users.find((user) => user.id === vehicle.id_user);
                const isEditing = vehicle.id === editedVehicle?.id;

                return (
                  <tr key={vehicle.id}>
                    <td>{user ? user.email : '-'}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={licensePlate}
                          onChange={(e) => this.setState({ licensePlate: e.target.value })}
                        />
                      ) : (
                        vehicle.licensePlate
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="datetime-local"
                          value={timeIn}
                          onChange={(e) => this.setState({ timeIn: e.target.value })}
                        />
                      ) : (
                        vehicle.timeIn
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="datetime-local"
                          value={timeOut}
                          onChange={(e) => this.setState({ timeOut: e.target.value })}
                        />
                      ) : (
                        vehicle.timeOut
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <button className="button" onClick={() => this.handleUpdate(vehicle.id)}>
                          Save
                        </button>
                      ) : (
                        <button className="button" onClick={() => this.handleEditButtonClick(vehicle.id)}>
                          <FontAwesomeIcon icon={faPencilAlt} /> Edit
                        </button>
                      )}
                    </td>
                    <td>
                      <button className="button" onClick={() => this.handleDeleteVehicle(vehicle.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>
    );
  }
}

export default Gestion;
