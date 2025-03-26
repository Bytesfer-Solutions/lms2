import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.jpg';
import profilePic from './assets/photo7.jpg';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';
import './Dashboard.css';

const Dashboard = ({ onLogout, role }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Company Logo" className="logo" />
          <span className="company-name">Bytesfer Solutions</span>
        </div>

        <div className="navbar-right">
          <div className="profile-section" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <span className="username">John Doe</span>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => setIsEditProfileOpen(true)}>Edit Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="dashboard-content">
        {role === 'admin' && <AdminDashboard />}
        {role === 'instructor' && <InstructorDashboard />}
        {role === 'student' && <StudentDashboard />}
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <input type="text" placeholder="Enter Name" />
            <input type="email" placeholder="Enter Email" />
            <input type="file" />
            <div className="modal-actions">
              <button onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
              <button>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
