import React, { useState } from "react";
import "./AuthModal.css";

const Signup = ({ isOpen, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character (@$!%*?&).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setErrorMessage(passwordValidation);
      setIsLoading(false);
      return;
    }
    if (password !== rePassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const url = "/api/register";
    const body = { name, email, password, rePassword, role };

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
      setTimeout(() => {
        alert("Signup successful! Please login to continue.");
        onClose();
        onAuthSuccess(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>&times;</button>
          <h2>Sign Up</h2>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
              {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : "Sign Up"}
            </button>
          </form>

          <p className="switch-text">
            Already have an account? 
            <button type="button" className="switch-btn" onClick={onClose}>
              Login
            </button>
          </p>
        </div>
      </div>
    )
  );
};

export default Signup;