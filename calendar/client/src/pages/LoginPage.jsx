// pages/LoginPage.jsx
// Login page component
// Demonstrates: useState, useDispatch, useSelector, async functions

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFail } from '../redux/authSlice';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

function LoginPage() {
  // ============================================
  // STATE - Component memory using useState
  // ============================================

  // Form input state
  const [email, setEmail] = useState('');          // Email input value
  const [password, setPassword] = useState('');    // Password input value

  // Redux state (from store)
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  // Navigation
  const navigate = useNavigate();

  // ============================================
  // EVENT HANDLERS
  // ============================================

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent page reload

    // Validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Dispatch loading action to Redux
      dispatch(loginStart());

      // Call API
      const response = await authAPI.login(email, password);

      // API returned: { success: true, message: "...", token: "...", user: {...} }
      const { token, user } = response.data;

      // Dispatch success action to Redux
      dispatch(loginSuccess({ token, user }));

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (err) {
      // Get error message from API or use default
      const errorMsg = err.response?.data?.message || 'Login failed';
      dispatch(loginFail(errorMsg));
    }
  };

  // ============================================
  // RENDER - Return JSX
  // ============================================

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>📅 Calendar App</h1>
        <h2>Login</h2>

        {/* Show error message if login failed */}
        {error && <div className="error-message">{error}</div>}

        {/* Login form */}
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Update state on change
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Update state on change
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}  // Disable while loading
            className="btn-submit"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to register page */}
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        {/* Test credentials */}
        <div className="test-credentials">
          <p>Test Credentials:</p>
          <p>Email: testuser@example.com</p>
          <p>Password: Test@123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
