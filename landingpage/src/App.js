import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Dashboard from './Dashboard';
import UpdateProfile from './UpdateProfile';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'student');

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('userRole', userRole);
  }, [isAuthenticated, userRole]);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('student');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage isAuthenticated={isAuthenticated} onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} role={userRole} />
            ) : (
              <HomePage isAuthenticated={isAuthenticated} onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/update-profile"
          element={isAuthenticated ? <UpdateProfile /> : <HomePage onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
};

export default App;