import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

const Login = ({ isOpen, onClose, onAuthSuccess, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const url = "/api/login";
    const body = { email, password };

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
        onClose();
        onAuthSuccess(true, data.role);
        navigate("/dashboard");
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
          <h2>{isForgotPasswordView ? "Forgot Password" : "Login"}</h2>

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
              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="spinner"></span> : "Login"}
              </button>
            </form>
          )}

          {!isForgotPasswordView && (
            <p className="switch-text">
              Don't have an account?{" "}
              <button type="button" className="switch-btn" onClick={switchToSignup}>
                Sign Up
              </button>
            </p>
          )}

          {!isForgotPasswordView && (
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

export default Login;