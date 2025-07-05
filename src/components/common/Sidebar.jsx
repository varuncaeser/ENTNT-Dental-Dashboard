// src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Although not strictly necessary here, good practice for context usage

const Sidebar = () => {
  const { isAdmin } = useAuth(); // Ensure this sidebar is only rendered for Admin
  
  if (!isAdmin) {
    return null; // Or handle redirection if accessed inappropriately
  }

  const linkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg text-white text-lg transition-colors duration-200 ${
      isActive ? 'bg-blue-600 shadow-inner' : 'hover:bg-blue-700'
    }`;

  return (
    <div className="w-64 bg-blue-800 text-white p-6 shadow-xl h-full flex flex-col">
      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <NavLink to="/admin/dashboard" className={linkClasses}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-10-7v10a1 1 0 01-1 1H6a1 1 0 01-1-1v-4m0 0h14" />
              </svg>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/patients" className={linkClasses}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M12 20a9 9 0 100-18 9 9 0 000 18zm0 0v-4.5M12 20h.01M17.25 15.654A4 4 0 0012 13a4 4 0 00-5.25 2.654M4.75 4.75h.01" />
              </svg>
              Patients
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/appointments" className={linkClasses}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h8m-8 4h8m-7 4h6M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/calendar" className={linkClasses}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h8m-8 4h8m-7 4h6m-7-4v4m-5-4v4m0 0v-4m0 0H7m-4 0v4m-4-4v4m0 0h8" />
              </svg>
              Calendar
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;