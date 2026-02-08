// components/Toast.jsx
// Toast notification component for success/error messages

import React, { useEffect } from 'react';
import '../styles/Toast.css';

function Toast({ message, type = 'success', onClose, autoClose = true }) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? '✓' : '✕'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
      {onClose && (
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;
