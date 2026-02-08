// LoadingSpinner.jsx
// Reusable loading component shown while verifying token

import React from 'react';
import '../styles/LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Verifying your session...</p>
    </div>
  );
}
