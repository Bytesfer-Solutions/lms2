import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import "./HomePage.css";
import logo from "./assets/logo.jpg";
import photo1 from "./assets/photo1.jpg";
import photo2 from "./assets/photo2.jpg";
import photo3 from "./assets/photo3.jpg";
import photo4 from "./assets/photo4.jpg";
import LoginModal from "./Login";
import SignupModal from "./Signup";

const HomePage = ({ isAuthenticated, onLogin }) => {
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const contactsRef = useRef(null);
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [photo1, photo2, photo3, photo4];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSignUpClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleAuthSuccess = (isLogin, role) => {
    if (isLogin) {
      onLogin(role); // Set authentication state to true and role
      navigate("/dashboard"); // Redirect to dashboard after login
    }
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Company Logo" className="logo" />
          <span className="company-name">Bytesfer Solutions</span>
        </div>
        <div className="navbar-right">
          <ul className="menu">
            <li><a href="#home" onClick={() => scrollToSection(homeRef)}>Home</a></li>
            <li><a href="#services" onClick={() => scrollToSection(servicesRef)}>Services</a></li>
            <li><a href="#contacts" onClick={() => scrollToSection(contactsRef)}>Contacts</a></li>
          </ul>
          <div className="auth-buttons">
            {!isAuthenticated && (
              <>
                <button className="login-btn" onClick={handleLoginClick}>Login</button>
                <button className="signup-btn" onClick={handleSignUpClick}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        switchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        switchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <section id="home" ref={homeRef}>
        <h1>Learn from the Best Courses Online</h1><br></br>
        <p>Discover thousands of courses from industry experts</p><br></br>
        <input type="text" placeholder="Search for courses..." className="srchbar" /><br></br>
        <button className="search-button">Search</button>
      </section>

      <div className="photos-section">
        <h2>PROJECT</h2>
        <div className="carousel">
          <button className="carousel-button prev" onClick={goToPrevious}>&#10094;</button>
          <img src={images[currentIndex]} alt={`Photo ${currentIndex + 1}`} className="carousel-image" />
          <button className="carousel-button next" onClick={goToNext}>&#10095;</button>
        </div>
      </div>

      <div ref={servicesRef} className="services-section">
        <h2>Our Services</h2>
        <div className="services">
          <div className="service">
            <h3>App Development</h3>
            <p>We build amazing mobile and web applications.</p>
          </div>
          <div className="service">
            <h3>Java</h3>
            <p>Expertise in Java-based solutions and frameworks.</p>
          </div>
          <div className="service">
            <h3>Python</h3>
            <p>Python development for data science, automation, and more.</p>
          </div>
        </div>
      </div>

      <div ref={contactsRef} className="contacts-section">
        <h2 className="contact-heading">Contact Us</h2>

        <div className="contact-card">
          {/* Email Section */}
          <div className="contact-item">
            <Mail className="contact-icon email-icon" size={24} />
            <div className="contact-info">
              <span>Email:</span>
              <a href="mailto:info@bytesfer.com" className="contact-link">
                info@bytesfer.com
              </a>
            </div>
          </div>

          {/* Phone Section */}
          <div className="contact-item">
            <Phone className="contact-icon phone-icon" size={24} />
            <div className="contact-info">
              <span>Phone:</span>
              <a href="tel:+9876543210" className="contact-link">
                +987 654 3210
              </a>
            </div>
          </div>

          {/* Address Section */}
          <div className="contact-item">
            <i className="fas fa-map-marker-alt contact-icon"></i>
            <div className="contact-info">
              <span>Address:</span>
              <p>Bytesfer Solution, Bangalore, India</p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>&copy; 2025 Bytesfer Solution. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;