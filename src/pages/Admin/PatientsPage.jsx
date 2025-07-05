// src/pages/Admin/PatientsPage.jsx
import React, { useState, useEffect } from 'react';
import { getPatients, savePatients, getUsers, saveUsers, getIncidents, saveIncidents } from '../../utils/localStorage';
import PatientForm from '../../components/forms/PatientForm'; // Import the PatientForm component
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const openModal = (patient = null) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleSavePatient = (formData) => {
    let updatedPatients;
    if (editingPatient) {
      // Edit existing patient
      updatedPatients = patients.map((p) =>
        p.id === editingPatient.id ? { ...p, ...formData } : p
      );
    } else {
      // Add new patient
      const newPatient = { id: uuidv4(), ...formData };
      updatedPatients = [...patients, newPatient];
    }
    savePatients(updatedPatients);
    setPatients(updatedPatients);
    closeModal();
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient and all associated incidents and patient user accounts?')) {
      // Delete patient from patients list
      const updatedPatients = patients.filter((p) => p.id !== patientId);
      savePatients(updatedPatients);
      setPatients(updatedPatients);

      // Delete associated incidents
      const incidents = getIncidents();
      const updatedIncidents = incidents.filter(inc => inc.patientId !== patientId);
      saveIncidents(updatedIncidents);

      // Delete associated patient user account
      const users = getUsers();
      const updatedUsers = users.filter(user => !(user.role === 'Patient' && user.patientId === patientId));
      saveUsers(updatedUsers);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-600 pb-2">Patient Management</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search patients by name or contact..."
          className="p-3 border border-gray-300 rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Patient
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {filteredPatients.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No patients found. Click "Add New Patient" to get started!</p>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-blue-100 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  DOB
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Health Info
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{patient.name}</p>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{patient.dob}</p>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{patient.contact}</p>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-pre-wrap">{patient.healthInfo}</p>
                  </td>
                  <td className="px-5 py-5 text-sm text-center">
                    <button
                      onClick={() => openModal(patient)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200"
                      title="Edit Patient"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title="Delete Patient"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <PatientForm
              patient={editingPatient}
              onSubmit={handleSavePatient}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;