import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash ,faPlus } from '@fortawesome/free-solid-svg-icons';
import './Gestion.css';
import axios from 'axios';

class Gestion extends React.Component {
  state = {
    vecHistoImported: [],
    users: [],
    vecHistoUpdated:[] ,
    showAddForm :false ,
    showEditForm:false ,
    editedVehicle : null ,
    licensePlate: '',
    timeIn: '',
    timeOut: '',
    lp:''
  };

// Recupaire donnes
  componentDidMount() {
    axios
      .get('http://localhost:8000/VecHisto')
      .then((response) => {
        console.log(response.data);
        this.setState({ vecHistoImported: response.data });
        this.setState({ vecHistoUpdated: this.state.vecHistoImported });
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('http://localhost:8000/Users')
      .then((response) => {
        console.log(response.data);
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }


// Modifier 

handleUpdate = (id) => {
  const { vecHistoUpdated, licensePlate, timeIn, timeOut } = this.state;
/*
  // Vérifier si timeIn est supérieur à Date.now() et inférieur à timeOut
  const parsedTimeIn = Date.parse(timeIn);
  const parsedTimeOut = Date.parse(timeOut);
  const currentTime = Date.now();

  if (isNaN(parsedTimeIn) || isNaN(parsedTimeOut)) {
    alert('Invalid date/time format');
    return;
  }
  if (parsedTimeIn > currentTime || parsedTimeOut > currentTime) {
    alert('Please choose a correct time entry');
    return;
  }
  if (parsedTimeIn >= parsedTimeOut) {
    alert('Time In must be earlier than Time Out');
    return;
  } */
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
      console.log('Données mises à jour avec succès :', response.data);
      this.setState({ vecHistoUpdated: updatedVecHisto });
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
};



//Supprimer
  handleDeleteVehicle = (vehicleId) => {
    const updatedVecHisto = this.state.vecHistoUpdated.filter((vehicle) => vehicle.id !== vehicleId);
    this.setState({ vecHistoUpdated: updatedVecHisto });
    axios.delete('http://localhost:8000/VecHisto/'+ vehicleId)
    .then(response => {console.log('vehicle deleted'); })
    .catch(error => {
    console.error(' erreur' , error);
  });
  };
// aff de form
 handleAddButtonClick = () => {
  this.setState({ showAddForm: true });
};
handleEditButtonClick = () => {
  this.setState({ showEditForm: true });
};
// Cancel
handleCancelAdd = () => {
  this.setState({ showAddForm: false });};  
handleCancelEdit = () => {
    this.setState({ showEditForm: false });};  
  
//ADD
handleAddVehicle = () => {
  const { licensePlate, timeIn, timeOut, vecHistoUpdated } = this.state;
  if (!licensePlate || !timeIn) {// Si les champs ne sont pas remplit
    alert('Please fill in both License Plate and Time In fields.');
    return;
  }
  // coast timeIn / verifier que uadmin a choisit t>de db
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
  const { vecHistoUpdated, users, showAddForm, showEditForm, editedVehicleId, updatedLicensePlate, updatedTimeIn, updatedTimeOut } = this.state;

  return (
    <div className="table-container">
      <center>
        <h2>Management</h2>
        <p className="description">Here you can manage your website.</p>
      </center>

      <div className="button-container">
        <button className="button add-button" onClick={this.handleAddButtonClick}>
        <FontAwesomeIcon icon={faPlus} />  Add Vehicle
        </button>
      </div>
      {showEditForm && (
        <div className="form-container">
          <input
            type="text"
            value={updatedLicensePlate}
            onChange={(e) => this.setState({ updatedLicensePlate: e.target.value })}
          />
          <input
            type="datetime-local"
            value={updatedTimeIn}
            onChange={(e) => this.setState({ updatedTimeIn: e.target.value })}
          />
          <input
            type="datetime-local"
            value={updatedTimeOut}
            onChange={(e) => this.setState({ updatedTimeOut: e.target.value })}
          />
          <button className="button" onClick={() => this.handleUpdate(editedVehicleId)}>
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
            value={this.state.licensePlate}
            onChange={(e) => this.setState({ licensePlate: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="Time In"
            value={this.state.timeIn}
            onChange={(e) => this.setState({ timeIn: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="Time Out"
            value={this.state.timeOut}
            onChange={(e) => this.setState({ timeOut: e.target.value })}
          />
          <button className="button" onClick={this.handleAddVehicle}>
          <FontAwesomeIcon icon={faPlus} />  Add
          </button>
          <button className="button" onClick={this.handleCancelAdd}>
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
              const isEditing = vehicle.id === editedVehicleId;

              return (
                <tr key={vehicle.id}>
                  <td>{user ? user.email : '-'}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={updatedLicensePlate}
                        onChange={(e) => this.setState({ updatedLicensePlate: e.target.value })}
                      />
                    ) : (
                      vehicle.licensePlate
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={updatedTimeIn}
                        onChange={(e) => this.setState({ updatedTimeIn: e.target.value })}
                      />
                    ) : (
                      vehicle.timeIn
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={updatedTimeOut}
                        onChange={(e) => this.setState({ updatedTimeOut: e.target.value })}
                      />
                    ) : (
                      vehicle.timeOut
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <button className="button" onClick={() => this.handleUpdate(vehicle.id)}>
                        Update
                      </button>
                    ) : (
                      <button className="button" onClick={() => this.handleEditButtonClick(vehicle.id)}>
                      <FontAwesomeIcon icon={faPencilAlt } />  Edit
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="button" onClick={() => this.handleDeleteVehicle(vehicle.id)}>
                    <FontAwesomeIcon icon={faTrash} />  Delete
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








