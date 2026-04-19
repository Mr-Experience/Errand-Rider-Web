import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="logo">
            <span className="logo-errand">Errand</span>
            <span className="logo-riders">Riders</span>
          </div>
          <p className="footer-desc">
            Fast, reliable, and convenient delivery services right at your doorstep.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="#team">About Us</a>
            <a href="#partners">Partners</a>
            <a href="#riders">Riders</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Portal Access</h3>
          <div className="footer-links">
            <Link to="/admin/login">Admin Login</Link>
            <Link to="/vendor/login">Vendor Login</Link>
            <Link to="/rider/login">Rider Login</Link>
          </div>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@errandriders.com</p>
          <p>Location: Nigeria</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Errand Riders. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
