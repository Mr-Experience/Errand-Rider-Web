import { useState, useEffect } from 'react';
import './Hero.css';
import illustration from '../assets/illustration.svg';
import road from '../assets/road.svg';
import playstoreIcon from '../assets/playstore.svg';
import appstoreIcon from '../assets/appstore.svg';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDownloadLink = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return "https://play.google.com/store";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "https://apps.apple.com";
    }
    return "#";
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="reveal fade-up" style={{ animationDelay: '0.1s' }}>
          Everything You Need,<br />Right to Your Door
        </h1>
        <p className="reveal fade-up" style={{ animationDelay: '0.3s' }}>
          Shop, send packages, and get what you need without<br />stepping out. Fast and reliable
        </p>
        <div className="hero-buttons reveal fade-up" style={{ animationDelay: '0.5s' }}>
          <button className="download-btn">
            <img src={playstoreIcon} alt="Play Store" className="btn-icon" />
            <div className="btn-text">
              <span className="btn-label">Get it on</span>
              <span className="btn-store">Play store</span>
            </div>
          </button>
          <button className="download-btn">
            <img src={appstoreIcon} alt="App Store" className="btn-icon" />
            <div className="btn-text">
              <span className="btn-label">Download on</span>
              <span className="btn-store">App store</span>
            </div>
          </button>
        </div>
      </div>

      <div className="hero-images-container reveal scale-up" style={{ animationDelay: '0.8s' }}>
        {isMobile ? (
          <div className="mobile-image-wrapper">
            <img src={road} alt="Bike" className="hero-img" />
          </div>
        ) : (
          <>
            <img src={illustration} alt="Left illustration" className="hero-img" />
            <img src={road} alt="Right illustration" className="hero-img" />
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;
