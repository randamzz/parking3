import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Cud.css';
import React, { Component } from 'react';

class Cud extends Component {
  state = {
    vecHistoImported: [],
    users: [],
    editedVehicleId: null,
    vecHistoUpdated: [],
    showAddForm: false,
    editedVehicle: null,
    licensePlate: '',
    timeIn: '',
    timeOut: '',
    editedVehicleIdUser: ''
  };

  componentDidMount() {
    this.fetchData('http://localhost:5000/VecHisto', 'vecHistoImported', 'vecHistoUpdated');
    this.fetchData('http://localhost:5000/Users', 'users');
  }

  fetchData = (url, dataKey, updateKey = null) => {
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        const newState = { [dataKey]: response.data };
        if (updateKey) {
          newState[updateKey] = response.data;
        }
        this.setState(newState);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleDeleteVehicle = (vehicleId) => {
    const { vecHistoUpdated } = this.state;
    const updatedVecHisto = vecHistoUpdated.filter((vehicle) => vehicle.id !== vehicleId);
    this.setState({ vecHistoUpdated: updatedVecHisto });

    axios
      .delete(`http://localhost:5000/VecHisto/${vehicleId}`)
      .then(() => {
        console.log('Vehicle deleted');
      })
      .catch((error) => {
        console.error('Erreur', error);
      });
  };

  handleAddButtonClick = () => {
    this.setState({ showAddForm: true });
  };

  handleCancelAdd = () => {
    this.setState({ showAddForm: false });
  };

  handleAddVehicle = () => {
    const { licensePlate, timeIn, timeOut, vecHistoUpdated } = this.state;
    if (!licensePlate || !timeIn) {
      alert('Please fill in both License Plate and Time In fields.');
      return;
    }

    const parsedTimeIn = Date.parse(timeIn);
    if (isNaN(parsedTimeIn)) {
      alert('Invalid Time In format');
      return;
    }

    const timeInDate = new Date(parsedTimeIn);
    if (timeInDate < Date.now()) {
      alert('Please choose a correct time entry');
      return;
    }

    const newVehicle = {
      id: vecHistoUpdated.length + 1,
      licensePlate,
      timeIn,
      timeOut,
    };

    axios
      .post('http://localhost:5000/VecHisto', newVehicle)
      .then((response) => {
        console.log('Vehicle inserted', response.data);
        this.setState((prevState) => ({
          vecHistoUpdated: [...prevState.vecHistoUpdated, newVehicle],
          showAddForm: false,
          licensePlate: '',
          timeIn: '',
          timeOut: '',
        }));
      })
      .catch((error) => {
        console.error('Erreur', error);
      });
  };

  handleVehicleClick = (id) => {
    const { vecHistoUpdated, users } = this.state;
    const clickedVehicle = vecHistoUpdated.find((vehicle) => vehicle.id === id);
    const user = users.find((user) => user.id === clickedVehicle?.id_user);
    if (clickedVehicle && user) {
      this.setState({
        editedVehicleId: clickedVehicle.id,
        editedVehicleIdUser: clickedVehicle.id_user,
        licensePlate: clickedVehicle.licensePlate,
        timeIn: clickedVehicle.timeIn,
        timeOut: clickedVehicle.timeOut,
      });
    }
  };

  handleEdit = (id) => {
    const { vecHistoUpdated } = this.state;
    const clickedVehicle = vecHistoUpdated.find((vehicle) => vehicle.id === id);

    if (clickedVehicle) {
      this.setState({
        editedVehicleId: clickedVehicle.id,
        editedVehicleIdUser: clickedVehicle.id_user,
        licensePlate: clickedVehicle.licensePlate,
        timeIn: clickedVehicle.timeIn,
        timeOut: clickedVehicle.timeOut,
      });
    }
  };

  handleUpdate = async (id, id_user) => {
    const { licensePlate, timeIn, timeOut, vecHistoUpdated } = this.state;
    const modifiedVehicle = {
      id: id,
      id_user: id_user,
      licensePlate: licensePlate,
      timeIn: timeIn,
      timeOut: timeOut,
    };

    try {
      await axios.put(`http://localhost:5000/VecHisto/${id}`, modifiedVehicle);
      const updatedVecHisto = vecHistoUpdated.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...modifiedVehicle } : vehicle
      );
      this.setState({
        vecHistoUpdated: updatedVecHisto,
        editedVehicleId: null,
        editedVehicleIdUser: null,
        licensePlate: '',
        timeIn: '',
        timeOut: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleCancelEdit = () => {
    this.setState({
      editedVehicleId: null,
      editedVehicleIdUser: null,
      licensePlate: '',
      timeIn: '',
      timeOut: '',
    });
  };

  render() {
    const { vecHistoUpdated, users, editedVehicleId, editedVehicleIdUser, licensePlate, timeIn, timeOut } = this.state;
    const buttonColors = ['#7d0013', '#b4575c', '#706c6f', '#443c41', '#3e0610'];

    return (
      <div className="gestion-container">
        <br />
        <h2 className="text-center">Management</h2>
        <p className="text-center description">Here you can manage your website.</p>
        <div className="input-group mb-3">
          <button
            className="button add-button"
            onClick={this.handleAddButtonClick}
            style={{ backgroundColor: buttonColors[0] }}>
            <FontAwesomeIcon icon={faPlus} /> Add Vehicle
          </button>
        </div>
        {this.state.showAddForm && (
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="License Plate"
              className="form-control"
              value={licensePlate}
              onChange={this.handleInputChange}
              name="licensePlate"
                           />
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Time In"
                  value={timeIn}
                  onChange={this.handleInputChange}
                  name="timeIn"
                />
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Time Out"
                  value={timeOut}
                  onChange={this.handleInputChange}
                  name="timeOut"
                />
                <button className="button" onClick={this.handleAddVehicle} style={{ backgroundColor: buttonColors[3] }}>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
                <button className="button" onClick={this.handleCancelAdd} style={{ backgroundColor: buttonColors[4] }}>
                  Cancel
                </button>
              </div>
            )}

            {editedVehicleId && (
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="licensePlate"
                  value={licensePlate}
                  onChange={this.handleInputChange}
                />
                <input
                  type="datetime-local"
                  className="form-control"
                  name="timeIn"
                  value={timeIn}
                  onChange={this.handleInputChange}
                />
                <input
                  type="datetime-local"
                  className="form-control"
                  name="timeOut"
                  value={timeOut}
                  onChange={this.handleInputChange}
                />
                <button className="button" onClick={() => this.handleUpdate(editedVehicleId, editedVehicleIdUser)} style={{ backgroundColor: buttonColors[3] }}>
                  Save
                </button>
                <button className="button" onClick={this.handleCancelEdit} style={{ backgroundColor: buttonColors[4] }}>
                  Cancel
                </button>
              </div>
            )}

            <table className="table table-striped">
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
                  const userEmail = user ? user.email : '';
                  return (
                    <tr key={vehicle.id}>
                      <td>{userEmail}</td>
                      <td>{vehicle.licensePlate}</td>
                      <td>{vehicle.timeIn}</td>
                      <td>{vehicle.timeOut}</td>
                      <td>
                        <button className="button" onClick={() => this.handleEdit(vehicle.id, vehicle.id_user)} style={{ backgroundColor: buttonColors[2] }}>
                          <FontAwesomeIcon icon={faPencilAlt} /> Edit
                        </button>
                      </td>
                      <td>
                        <button className="button" onClick={() => this.handleDeleteVehicle(vehicle.id)} style={{ backgroundColor: buttonColors[1] }}>
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

export default Cud;
