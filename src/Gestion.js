import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { vecHisto, users } from './Data';
import './Gestion.css';
const Gestion = () => {
  const [filteredVecHisto, setFilteredVecHisto] = useState(vecHisto);
  const [searchValue, setSearchValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(null);
  const [licensePlate, setLicensePlate] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [lp, setLp] = useState('');

  useEffect(() => {
    setFilteredVecHisto(vecHisto);
  }, []);

  const handleSearch = () => {
    const filteredVecHisto = vecHisto.filter((vehicle) =>
      vehicle.licensePlate.includes(searchValue)
    );
    setFilteredVecHisto(filteredVecHisto);
    setSearchValue('');
  };

  const handleCancelSearch = () => {
    setSearchValue('');
    setFilteredVecHisto(vecHisto);
  };

  const handleAddVehicle = () => {
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
      id: vecHisto.length + 2,
      licensePlate,
      timeIn,
      timeOut,
    };

    setFilteredVecHisto([...filteredVecHisto, newVehicle]);
    setLicensePlate('');
    setTimeIn('');
    setTimeOut('');

  };

  const handleEditVehicle = (vehicleId, editedLicensePlate, editedTimeIn,editedTimeOut) => {
    const updatedVecHisto = vecHisto.map((vehicle) => {
      if (vehicle.id === vehicleId) {
        setLp(editedLicensePlate);
        return {
          ...vehicle,
          licensePlate: editedLicensePlate,
          timeIn: editedTimeIn,
          timeOut:editedTimeOut,
        };
      }
      return vehicle;
    });
    setFilteredVecHisto(updatedVecHisto);
  };

  const handleDeleteVehicle = (vehicleId) => {
    const updatedVecHisto = vecHisto.filter((vehicle) => vehicle.id !== vehicleId);
    setFilteredVecHisto(updatedVecHisto);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleEditButtonClick = (vehicleId, licensePlate) => {
    const editedVehicle = vecHisto.find((vehicle) => vehicle.id === vehicleId);
    setLp(licensePlate);
    setEditedVehicle(editedVehicle);
    setShowAddForm(true);
  };

  const handleSaveEdit = () => {
    if (!licensePlate || !timeIn) {
      alert('Please fill in both License Plate and Time In fields.');
      return;
    }

    const updatedVecHisto = vecHisto.map((vehicle) => {
      if (vehicle.id === editedVehicle.id) {
        return {
          ...vehicle,
          licensePlate,
          timeIn,
          timeOut,
        };
      }
      return vehicle;
    });

    setFilteredVecHisto(updatedVecHisto);
    setEditedVehicle(null);
    setLicensePlate('');
    setTimeIn('');
  };

  const handleAddButtonClick = () => {
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditedVehicle(null);
    setShowAddForm(false);
  };
  return (
    <div className="gestion-container">
      <h2>Management</h2>
      <p className="description">Here you can manage your website.</p>
  
      <div className="form-container">
        <input
          type="text"
          placeholder="License Plate"
          name="searchValue"
          value={searchValue}
          onChange={handleInputChange}
        />
        <button className="button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
      </div>
  
      {showAddForm ? (
        <div className="form-container">
          <h3>{editedVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
          {editedVehicle ? (
            <>
              <input
                type="text"
                placeholder="License Plate"
                onChange={(e) => setLicensePlate(e.target.value)}
              />
              <input
                type="datetime-local"
                placeholder="Time In"
                onChange={(e) => setTimeIn(e.target.value)}
              />
               <input
                type="datetime-local"
                placeholder="Time Out"
                onChange={(e) => setTimeOut(e.target.value)}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="License Plate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
              <input
                type="datetime-local"
                placeholder="Time In"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
              />
                <input
                type="datetime-local"
                placeholder="Time Out"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
              />
            </>
          )}
          <button className="button" onClick={editedVehicle ? handleSaveEdit : handleAddVehicle}>
            <FontAwesomeIcon icon={editedVehicle ? faPencilAlt : faPlus} /> {editedVehicle ? 'Save' : 'Add'}
          </button>
          <button className="button cancel-button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="button-container">
          <button className="button add-button" onClick={handleAddButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Vehicle
          </button>
        </div>
      )}
  
      <div className="table-container">
        {filteredVecHisto.length > 0 ? (
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
              {filteredVecHisto.map((vehicle) => {
                const user = users.find((user) => user.id === vehicle.id_user);
                return (
                  <tr key={vehicle.id}>
                    <td>{user ? user.email : '-'}</td>
                    <td>{vehicle.licensePlate}</td>
                    <td>{vehicle.timeIn}</td>
                    <td>{vehicle.timeOut}</td>
                    <td>
                      <button className="button edit-button" onClick={() => handleEditButtonClick(vehicle.id, vehicle.licensePlate)}>
                        <FontAwesomeIcon icon={faPencilAlt} /> Edit
                      </button>
                    </td>
                    <td>
                      <button className="button delete-button" onClick={() => handleDeleteVehicle(vehicle.id)}>
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
    </div>
  );
  
};

export default Gestion;