// components/Calendar.jsx
// Interactive monthly calendar component
// Dispatches selected date to Redux so other components can fetch data

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../redux/dateSlice';
import '../styles/Calendar.css';

function Calendar() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.date.selectedDate);
  
  // ===== STATE MANAGEMENT =====
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 8)); // Feb 8, 2026

  // Get the first day of the month
  // This tells us where to START the calendar grid
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Get the last day of the month
  // This tells us HOW MANY days to display
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day of the week (0 = Sunday, 1 = Monday, etc.)
  // Example: If month starts on Wednesday, this would be 3
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Total days in the month
  const daysInMonth = lastDayOfMonth.getDate();

  // ===== HELPER FUNCTIONS =====

  // 1. Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  // 2. Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  // 3. Navigate to today
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch(setSelectedDate(today)); // Dispatch to Redux
  };

  // 4. Check if two dates are the same day (ignoring time)
  // Useful: Comparing today vs other dates, or selectedDate vs calendar days
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 5. Format month and year display
  // Example output: "February 2026"
  const formatMonthYear = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // ===== RENDER LOGIC =====

  // Arrays for day headers and empty cells
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create an array of calendar cells
  // Start with empty cells for days before month starts
  const calendarCells = [];
  
  // Add empty cells BEFORE the month starts
  // Example: If month starts on Wednesday (day 3), add 3 empty cells
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(null);
  }
  
  // Add cells for each day in the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <h3>{formatMonthYear(currentDate)}</h3>
        <div className="calendar-controls">
          <button className="btn-calendar-nav" onClick={handlePreviousMonth}>
            ← Prev
          </button>
          <button className="btn-today" onClick={handleToday}>
            Today
          </button>
          <button className="btn-calendar-nav" onClick={handleNextMonth}>
            Next →
          </button>
        </div>
      </div>

      {/* Day Headers (Sun, Mon, Tue, etc.) */}
      <div className="calendar-day-headers">
        {dayHeaders.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Days */}
      <div className="calendar-grid">
        {calendarCells.map((date, index) => {
          // Handle empty cells (days before/after month)
          if (!date) {
            return <div key={`empty-${index}`} className="calendar-cell empty"></div>;
          }

          // Check if this date is TODAY
          const isToday = isSameDay(date, new Date());
          
          // Check if this date is SELECTED by user
          // selectedDate is stored as ISO string, convert back to Date for comparison
          const isSelected = isSameDay(date, new Date(selectedDate));
          
          // Format date number (1, 2, 3... 31)
          const day = date.getDate();

          return (
            <div
              key={`date-${day}`}
              className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => dispatch(setSelectedDate(date.toISOString()))}
            >
              <span className="day-number">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Selected Date Display */}
      <div className="calendar-footer">
        <p className="selected-date-info">
          📅 Selected: <strong>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>
      </div>
    </div>
  );
}

export default Calendar;
