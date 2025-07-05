// src/pages/Admin/AppointmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { getIncidents, saveIncidents, getPatients } from '../../utils/localStorage';
import IncidentForm from '../../components/forms/IncidentForm';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns'; // For date formatting

const AppointmentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [patients, setPatients] = useState({}); // Map patient IDs to names for quick lookup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Scheduled', 'Completed', 'Pending', 'Cancelled'

  useEffect(() => {
    const fetchedPatients = getPatients();
    const patientMap = fetchedPatients.reduce((acc, patient) => {
      acc[patient.id] = patient.name;
      return acc;
    }, {});
    setPatients(patientMap);
    setIncidents(getIncidents());
  }, []);

  const openModal = (incident = null) => {
    setEditingIncident(incident);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIncident(null);
  };

  const handleSaveIncident = (formData) => {
    let updatedIncidents;
    if (editingIncident) {
      updatedIncidents = incidents.map((inc) =>
        inc.id === editingIncident.id ? { ...inc, ...formData } : inc
      );
    } else {
      const newIncident = { id: uuidv4(), ...formData };
      updatedIncidents = [...incidents, newIncident];
    }
    saveIncidents(updatedIncidents);
    setIncidents(updatedIncidents);
    closeModal();
  };

  const handleDeleteIncident = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      const updatedIncidents = incidents.filter((inc) => inc.id !== incidentId);
      saveIncidents(updatedIncidents);
      setIncidents(updatedIncidents);
    }
  };

  const getPatientName = (patientId) => {
    return patients[patientId] || 'N/A';
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchTerm === '' ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientName(incident.patientId).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || incident.status === filterStatus;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)); // Sort by most recent first

  // Styles for status badges
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-200 text-blue-800';
      case 'Completed': return 'bg-green-200 text-green-800';
      case 'Pending': return 'bg-yellow-200 text-yellow-800';
      case 'Cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-600 pb-2">Appointment Management</h1>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search incidents by title, description or patient..."
          className="p-3 border border-gray-300 rounded-md flex-grow max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Appointment
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {filteredIncidents.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No appointments found matching your criteria.</p>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-blue-100 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Appointment Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{getPatientName(incident.patientId)}</p>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{incident.title}</p>
                    <p className="text-gray-600 text-xs">{incident.description}</p>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {incident.appointmentDate ? format(new Date(incident.appointmentDate), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </p>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {incident.cost ? `$${incident.cost.toLocaleString()}` : 'N/A'}
                    </p>
                  </td>
                  <td className="px-5 py-5 text-sm text-center">
                    <button
                      onClick={() => openModal(incident)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200"
                      title="Edit Incident"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteIncident(incident.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title="Delete Incident"
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

      {/* Modal for Add/Edit Incident */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              {editingIncident ? 'Edit Appointment' : 'Add New Appointment'}
            </h2>
            <IncidentForm
              incident={editingIncident}
              onSubmit={handleSaveIncident}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;