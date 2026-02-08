// App.jsx
// Main component - sets up routing
// Like app.module.ts in Angular

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser } from './redux/authSlice';
import { authAPI } from './services/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);

  // On app load, verify token with BACKEND
  // This is a REAL app now - we don't blindly trust localStorage
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        
        // If no token in storage, we're not logged in
        if (!savedToken) {
          setIsVerifying(false);
          return;
        }

        // Call backend to verify the token is VALID
        // This prevents using expired or tampered tokens
        const response = await authAPI.getProfile();
        
        // Token is valid! Restore user with their data from backend
        dispatch(restoreUser({
          user: response.data.user,  // Real user data from backend
          token: savedToken
        }));
      } catch (error) {
        console.error('Token verification failed:', error);
        // Token is invalid/expired - clear it
        localStorage.removeItem('token');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [dispatch]);

  // Protected route component
  // Only shows component if user is logged in
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Show loading spinner while verifying token
  if (isVerifying) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
