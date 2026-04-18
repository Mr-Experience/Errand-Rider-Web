import { useState, useEffect } from 'react';
import './Hero.css';
import illustration from '../assets/illustration.svg';
import road from '../assets/road.svg';
import playstoreIcon from '../assets/playstore.svg';
import appstoreIcon from '../assets/appstore.svg';

const Hero = () => {
  const [showBasket, setShowBasket] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    
    let interval;
    if (isMobile) {
      interval = setInterval(() => {
        setShowBasket(prev => !prev);
      }, 2000); 
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (interval) clearInterval(interval);
    };
  }, [isMobile]);

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
        <h1>Everything You Need,<br />Right to Your Door</h1>
        <p>Shop, send packages, and get what you need without<br />stepping out. Fast and reliable</p>
        <div className="hero-buttons">
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

      <div className="hero-images-container">
        {isMobile ? (
          <div className="mobile-image-wrapper">
            <img 
              src={road} 
              alt="Bike" 
              className={`hero-img mobile-anim ${showBasket ? 'fade-out' : 'fade-in'}`} 
            />
            <img 
              src={illustration} 
              alt="Basket" 
              className={`hero-img mobile-anim abs ${showBasket ? 'fade-in' : 'fade-out'}`} 
            />
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
