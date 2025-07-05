// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import LoginPage from './pages/Auth/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PatientsPage from './pages/Admin/PatientsPage'; // New Admin page
import AppointmentsPage from './pages/Admin/AppointmentsPage'; // New Admin page
import CalendarPage from './pages/Admin/CalendarPage'; // New Admin page
import PatientDashboard from './pages/Patient/PatientDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/common/Layout'; // Import the Layout component

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes wrapped with AdminRoute and Layout */}
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}> {/* Apply layout to admin specific pages */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/patients" element={<PatientsPage />} />
              <Route path="/admin/appointments" element={<AppointmentsPage />} />
              <Route path="/admin/calendar" element={<CalendarPage />} />
            </Route>
          </Route>

          {/* Patient Routes wrapped with PrivateRoute and (potentially a simpler) Layout */}
          <Route element={<PrivateRoute />}>
            {/* For Patient, we might use a different layout or just Navbar for now */}
            <Route path="/patient/dashboard" element={
              <>
                <Navbar /> {/* Patient view might not need sidebar */}
                <main className="flex-grow p-6">
                  <PatientDashboard />
                </main>
              </>
            } />
          </Route>

          {/* Default redirect to login for any unhandled paths */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;