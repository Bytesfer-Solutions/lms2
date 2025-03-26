import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profilePic from "./assets/logo.jpg";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose, isLoginView, switchView, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!isLoginView) {
      setPasswordError(validatePassword(password));
      setConfirmPasswordError(rePassword && password !== rePassword ? "Passwords do not match" : "");
    } else {
      setPasswordError("");
      setConfirmPasswordError("");
    }
  }, [password, rePassword, isLoginView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (!isLoginView) {
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
    }

    const url = isLoginView ? "/api/login" : "/api/register";
    const body = isLoginView ? { email, password } : { name, email, password, rePassword, role };

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
        if (isLoginView) {
          onClose();
          onAuthSuccess(true, data.role);
          navigate("/dashboard");
        } else {
          alert("Signup successful! Please login to continue.");
          onClose();
          onAuthSuccess(false);
          switchView();
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message || "Password reset link sent to your email.");
      setIsLoading(false);
      setIsForgotPasswordView(false);
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
          <h2>{isForgotPasswordView ? "Forgot Password" : isLoginView ? "Login" : "Sign Up"}</h2>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          {isForgotPasswordView ? (
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="spinner"></span> : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {!isLoginView && (
                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}

              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {/* {!isLoginView && (
                <div className="form-group">
                  <label>Role:</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )} */}

              <div className="form-group">
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {!isLoginView && passwordError && <p className="error-text">{passwordError}</p>}
              </div>

              {!isLoginView && (
                <div className="form-group">
                  <label>Confirm Password:</label>
                  <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
                  {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="spinner"></span> : isLoginView ? "Login" : "Sign Up"}
              </button>
            </form>
          )}

          {!isForgotPasswordView && (
            <p className="switch-text">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="switch-btn" onClick={switchView}>
                {isLoginView ? "Sign Up" : "Login"}
              </button>
            </p>
          )}

          {isLoginView && !isForgotPasswordView && (
            <p className="switch-text">
              <button type="button" className="switch-btn" onClick={() => setIsForgotPasswordView(true)}>
                Forgot Password?
              </button>
            </p>
          )}

          {isForgotPasswordView && (
            <p className="switch-text">
              <button type="button" className="switch-btn" onClick={() => setIsForgotPasswordView(false)}>
                Back to Login
              </button>
            </p>
          )}
        </div>
      </div>
    )
  );
};

export default AuthModal;