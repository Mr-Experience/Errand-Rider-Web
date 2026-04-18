import { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-errand">Errand</span>
        <span className="logo-riders">Riders</span>
      </div>
      
      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <a href="#team">Our Team</a>
        <a href="#partners">Patners</a>
        <a href="#riders">Riders</a>
        <a href="#ads">Ads Campaign</a>
      </nav>

      <div className="header-right">
        <div className="header-actions">
          <div className="location">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>NG</span>
          </div>
          <button className="contact-btn">Contact Us</button>
        </div>

        <button className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
