import React from 'react';
import './Features.css';
import card1 from '../assets/card1.svg';
import card2 from '../assets/card2.svg';
import card3 from '../assets/card3.svg';

const Features = () => {
  const featureData = [
    {
      title: 'Food',
      description: 'Get everyday essentials, groceries, and household items delivered straight to your door—quick, easy, and reliable.',
      color: '#E3DFF2', // Light Purple
      image: card1,
    },
    {
      title: 'Supermarket',
      description: 'Get everyday essentials, groceries, and household items delivered straight to your door—quick, easy, and reliable.',
      color: '#FFF1BB', // Light Yellow
      image: card2,
    },
    {
      title: 'Local Market',
      description: 'Enjoy fresh produce, local ingredients, and market favorites sourced directly from nearby vendors.',
      color: '#A5D1FF', // Light Blue
      image: card3,
    }
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>What's on board</h2>
        <p>Everything you need - in one place</p>
      </div>

      <div className="features-grid">
        {featureData.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card" 
            style={{ backgroundColor: feature.color }}
          >
            {feature.image ? (
              <div className="card-image-container">
                <img src={feature.image} alt={feature.title} className="card-img" />
              </div>
            ) : (
              <div className="card-image-placeholder"></div>
            )}
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
