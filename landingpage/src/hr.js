/// src/App.js
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import Dashboard from "./Dashboard";
import UpdateProfile from "./UpdateProfile";
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

const App = () => {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(authState));
  }, [authState]);

  const handleLogin = (userData) => {
    setAuthState({ isAuthenticated: true, user: userData });
  };

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem("auth");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage 
            isAuthenticated={authState.isAuthenticated} 
            onLogin={handleLogin} 
          />
        } />
        
        <Route path="/dashboard" element={
          authState.isAuthenticated ? (
            <Dashboard user={authState.user} onLogout={handleLogout} />
          ) : <Navigate to="/" />
        }>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="instructor" element={<InstructorDashboard />} />
          <Route path="student" element={<StudentDashboard />} />
        </Route>

        <Route path="/update-profile" element={
          authState.isAuthenticated ? <UpdateProfile user={authState.user} /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, isLoginView, switchView, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const navigate = useNavigate(); // 👈 Add navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!isLoginView && password !== rePassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const url = isLoginView ? "/api/login" : "/api/register";
    const body = isLoginView ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://127.0.0.1:5000${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(isLoginView ? "Login successful" : "Registration successful");
      onClose();
      onAuthSuccess(); // Notify parent component of authentication

      // 👇 Redirect to dashboard after login
      if (isLoginView) {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    isOpen && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>&times;</button>
          <h2>{isLoginView ? "Login" : "Sign Up"}</h2>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {!isLoginView && (
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  value={rePassword}
                  type="password"
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLoading ? "Processing..." : isLoginView ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="switch-text">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="switch-btn" onClick={switchView}>
              {isLoginView ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    )
  );
};

export default AuthModal;
