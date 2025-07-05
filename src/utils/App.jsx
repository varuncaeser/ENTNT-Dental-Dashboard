// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext'; // We will create this
import LoginPage from './pages/Auth/LoginPage'; // We will create this
import AdminDashboard from './pages/Admin/AdminDashboard'; // We will create this
import PatientDashboard from './pages/Patient/PatientDashboard'; // We will create this
import PrivateRoute from './components/common/PrivateRoute'; // We will create this
import AdminRoute from './components/common/AdminRoute'; // We will create this

function App() {
  return (
    <Router>
      <AuthProvider> {/* This will provide authentication context */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* More admin routes will go here */}
          </Route>

          {/* Patient Routes */}
          <Route element={<PrivateRoute />}> {/* Patient also needs to be logged in */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            {/* More patient routes will go here */}
          </Route>

          {/* Default redirect for now */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;