// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAdmin ? "/admin/dashboard" : "/patient/dashboard"} className="text-white text-2xl font-bold">
          DentalCare Pro
        </Link>
        <div className="flex items-center space-x-6">
          {currentUser && (
            <span className="text-white text-lg">
              Welcome, <span className="font-semibold">{currentUser.email}</span> ({currentUser.role})
            </span>
          )}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;