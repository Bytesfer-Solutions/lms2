import React from "react";
import { FaUserGraduate, FaUsers, FaBook, FaCog, FaChartBar, FaBell } from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const stats = [
    { id: 1, name: "Total Students", count: 1200, icon: <FaUserGraduate className="icon" /> },
    { id: 2, name: "Total Courses", count: 45, icon: <FaBook className="icon" /> },
    { id: 3, name: "Active Users", count: 950, icon: <FaUsers className="icon" /> },
    { id: 4, name: "System Settings", count: "Updated", icon: <FaCog className="icon" /> },
  ];

  const notifications = [
    "New student registered today",
    "5 new courses added",
    "Server maintenance scheduled for next weekend",
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="dashboard-card">
            <h2 className="card-title">{stat.icon} {stat.name}</h2>
            <p className="stat-count">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Notifications Section */}
      <div className="dashboard-card">
        <h2 className="card-title"><FaBell className="icon" /> Notifications</h2>
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
