// src/components/common/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading application...</div>
      </div>
    );
  }

  // If user is not logged in, or if it's a patient viewing a patient layout,
  // we might not need the full admin sidebar.
  // For simplicity, this layout assumes admin and includes sidebar.
  // We can add conditional rendering for patient-specific layouts later if needed.

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-grow">
        {currentUser?.role === 'Admin' && <Sidebar />} {/* Only show sidebar for Admin */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;