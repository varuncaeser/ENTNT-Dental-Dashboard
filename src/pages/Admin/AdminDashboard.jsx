// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getIncidents, getPatients } from '../../utils/localStorage';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({
    totalPatients: 0,
    upcomingAppointments: [],
    pendingTreatments: 0,
    completedTreatments: 0,
    totalRevenue: 0,
    topPatients: [], // To be implemented, requires more complex logic
  });

  useEffect(() => {
    const patients = getPatients();
    const incidents = getIncidents();

    // Calculate KPIs
    const totalPatients = patients.length;

    const now = new Date();
    const futureAppointments = incidents
      .filter(inc => new Date(inc.appointmentDate) >= now)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      [cite_start].slice(0, 10); // Next 10 appointments [cite: 31]

    const pendingTreatments = incidents.filter(inc => inc.status === 'Pending' || inc.status === 'Scheduled').length;
    const completedTreatments = incidents.filter(inc => inc.status === 'Completed').length;
    
    const totalRevenue = incidents
      .filter(inc => inc.status === 'Completed' && inc.cost)
      .reduce((sum, inc) => sum + inc.cost, 0);

    // Basic Top Patients (could be based on revenue or number of incidents)
    // For simplicity, let's just show top patients by number of incidents for now
    const patientIncidentCounts = incidents.reduce((acc, incident) => {
      acc[incident.patientId] = (acc[incident.patientId] || 0) + 1;
      return acc;
    }, {});

    const topPatientsData = Object.entries(patientIncidentCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5) // Top 5 patients
      .map(([patientId, count]) => {
        const patient = patients.find(p => p.id === patientId);
        return { name: patient ? patient.name : 'Unknown', incidents: count };
      });


    setKpis({
      totalPatients,
      upcomingAppointments: futureAppointments,
      pendingTreatments,
      completedTreatments,
      totalRevenue,
      topPatients: topPatientsData,
    });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-600 pb-2">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-600">Total Patients</h3>
          <p className="text-4xl font-bold text-blue-700 mt-2">{kpis.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-600">Pending Treatments</h3>
          <p className="text-4xl font-bold text-yellow-700 mt-2">{kpis.pendingTreatments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-600">Completed Treatments</h3>
          <p className="text-4xl font-bold text-green-700 mt-2">{kpis.completedTreatments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue (Completed)</h3>
          <p className="text-4xl font-bold text-purple-700 mt-2">${kpis.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Next 10 Appointments</h3>
          {kpis.upcomingAppointments.length > 0 ? (
            <ul className="space-y-3">
              {kpis.upcomingAppointments.map((incident) => {
                const patient = getPatients().find(p => p.id === incident.patientId);
                return (
                  <li key={incident.id} className="p-3 bg-blue-50 rounded-md flex justify-between items-center text-gray-700">
                    <div>
                      <p className="font-semibold text-blue-800">{incident.title}</p>
                      <p className="text-sm">Patient: {patient ? patient.name : 'N/A'}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {format(new Date(incident.appointmentDate), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">No upcoming appointments.</p>
          )}
        </div>

        {/* Top Patients */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Top Patients (by Incidents)</h3>
          {kpis.topPatients.length > 0 ? (
            <ul className="space-y-3">
              {kpis.topPatients.map((patient, index) => (
                <li key={index} className="p-3 bg-green-50 rounded-md flex justify-between items-center text-gray-700">
                  <span className="font-semibold text-green-800">{patient.name}</span>
                  <span className="text-sm font-medium text-gray-600">{patient.incidents} Incidents</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No patient data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;