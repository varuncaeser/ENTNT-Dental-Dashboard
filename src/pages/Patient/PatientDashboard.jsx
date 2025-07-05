// src/pages/Patient/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPatients, getIncidents } from '../../utils/localStorage';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { currentUser } = useAuth(); // Get the logged-in patient user
  const [patientData, setPatientData] = useState(null);
  const [patientIncidents, setPatientIncidents] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'Patient' && currentUser.patientId) {
      const allPatients = getPatients();
      const allIncidents = getIncidents();

      // Find the current patient's data
      const currentPatient = allPatients.find(p => p.id === currentUser.patientId);
      setPatientData(currentPatient);

      // Filter incidents for the current patient
      const incidentsForPatient = allIncidents
        .filter(inc => inc.patientId === currentUser.patientId)
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)); // Sort by most recent first

      setPatientIncidents(incidentsForPatient);
    }
  }, [currentUser]);

  if (!currentUser || !patientData) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading patient data or no patient found for this user.
      </div>
    );
  }

  // Separate upcoming and past appointments
  const now = new Date();
  const upcomingAppointments = patientIncidents.filter(inc => new Date(inc.appointmentDate) >= now);
  const pastAppointments = patientIncidents.filter(inc => new Date(inc.appointmentDate) < now);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-600 pb-2">
        Welcome, {patientData.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Patient Health Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Health Information</h3>
          <p className="text-gray-700 mb-2"><strong>Date of Birth:</strong> {patientData.dob}</p>
          <p className="text-gray-700 mb-2"><strong>Contact:</strong> {patientData.contact}</p>
          <p className="text-gray-700"><strong>Health Notes:</strong> {patientData.healthInfo || 'No specific health notes.'}</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Your Appointments</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Upcoming Appointments</h3>
          {upcomingAppointments.length > 0 ? (
            <ul className="space-y-4">
              {upcomingAppointments.map((inc) => (
                <li key={inc.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="font-semibold text-blue-800 text-lg">{inc.title}</p>
                  <p className="text-sm text-gray-600">
                    <strong className="mr-1">Date & Time:</strong> {format(new Date(inc.appointmentDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="mr-1">Description:</strong> {inc.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="mr-1">Status:</strong> <span className="font-medium text-blue-700">{inc.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no upcoming appointments.</p>
          )}
        </div>

        {/* Appointment History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Appointment History</h3>
          {pastAppointments.length > 0 ? (
            <ul className="space-y-4">
              {pastAppointments.map((inc) => (
                <li key={inc.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="font-semibold text-gray-800 text-lg">{inc.title}</p>
                  <p className="text-sm text-gray-600">
                    <strong className="mr-1">Date:</strong> {format(new Date(inc.appointmentDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="mr-1">Status:</strong> <span className="font-medium text-gray-700">{inc.status}</span>
                  </p>
                  {inc.cost && (
                    <p className="text-sm text-gray-600">
                      <strong className="mr-1">Cost:</strong> <span className="font-medium">${inc.cost.toLocaleString()}</span>
                    </p>
                  )}
                  {inc.treatment && (
                    <p className="text-sm text-gray-600">
                      <strong className="mr-1">Treatment:</strong> {inc.treatment}
                    </p>
                  )}
                  {inc.nextDate && (
                    <p className="text-sm text-gray-600">
                      <strong className="mr-1">Next Appt:</strong> {format(new Date(inc.nextDate), 'MMM dd, yyyy HH:mm')}
                    </p>
                  )}
                  {inc.files && inc.files.length > 0 && (
                    <div className="mt-2">
                      <strong className="text-sm text-gray-700 block mb-1">Attached Files:</strong>
                      <ul className="list-disc list-inside text-sm text-blue-700">
                        {inc.files.map((file, idx) => (
                          <li key={idx}>
                            <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {file.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no past appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;