// pages/DashboardPage.jsx
// Dashboard - main app page after login
// Professional design with sections for Calendar, Events, and Todos

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { clearEvents } from '../redux/eventsSlice';
import { clearTodos } from '../redux/todosSlice';
import Calendar from '../components/Calendar';
import EventList from '../components/EventList';
import TodoList from '../components/TodoList';
import '../styles/Dashboard.css';

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      dispatch(clearEvents());
      dispatch(clearTodos());
      navigate('/login');
    }
  };

  return (
    <div className="dashboard">
      {/* Professional Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="logo">
              <span className="logo-icon">📅</span>
              <span className="logo-text">Calendar Pro</span>
            </div>
          </div>
          
          <div className="navbar-right">
            <div className="user-greeting">
              <div className="user-avatar">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.firstName || 'User'} {user?.lastName || ''}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header">
            <h1>Welcome back, {user?.firstName}! 👋</h1>
            <p className="subtitle">Organize your schedule and manage your tasks efficiently</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Calendar</h3>
                <p>View and manage your events</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📌</div>
              <div className="stat-content">
                <h3>Events</h3>
                <p>Schedule important meetings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>To-Do List</h3>
                <p>Track your daily tasks</p>
              </div>
            </div>
          </div>

          {/* Main Sections - Grid Layout */}
          <div className="dashboard-grid">
            {/* Calendar Section */}
            <div className="dashboard-section calendar-section">
              <div className="section-content calendar-content">
                <Calendar />
              </div>
            </div>

            {/* Events Section */}
            <div className="dashboard-section events-section">
              <div className="section-content events-content">
                <EventList />
              </div>
            </div>

            {/* To-Do Section */}
            <div className="dashboard-section todos-section">
              <div className="section-content todos-content">
                <TodoList />
              </div>
            </div>
          </div>

          {/* Quick Info Section */}
          <div className="quick-info-section">
            <h2>📊 Quick Info</h2>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-label">Today's Date:</span>
                <span className="info-value">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="info-card">
                <span className="info-label">Account:</span>
                <span className="info-value">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
