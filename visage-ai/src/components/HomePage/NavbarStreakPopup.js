import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import './NavbarStreakPopup.css';

const NavbarStreakPopup = ({ isOpen, onClose, anchorRef }) => {
  const [user] = useAuthState(auth);
  const [streakData, setStreakData] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);

  const formatDate = useCallback((date) => {
    return date.toISOString().split('T')[0];
  }, []);

  const isConsecutiveDay = useCallback((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }, []);

  const calculateStreaks = useCallback((data) => {
    const dates = Object.keys(data).sort();
    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    const today = new Date();
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000));

    // Calculate current streak (must include today or yesterday)
    if (data[todayStr] || data[yesterdayStr]) {
      let checkDate = data[todayStr] ? today : new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      while (data[formatDate(checkDate)]) {
        current++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    // Calculate longest streak
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || isConsecutiveDay(dates[i-1], dates[i])) {
        tempStreak++;
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
      }
    }
    longest = Math.max(longest, tempStreak);

    setCurrentStreak(current);
    setLongestStreak(longest);
  }, [formatDate, isConsecutiveDay]);

  // Load streak data from database on component mount
  useEffect(() => {
    const loadStreakData = async () => {
      if (!user?.uid) return;
      
      try {
        // First, try to load from database
        const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/streak/data/${user.uid}`);
        
        if (response.ok) {
          const result = await response.json();
          setStreakData(result.streak_data);
          console.log('✅ Streak data loaded from database:', result);
          return;
        }
      } catch (error) {
        console.log('Database streak load failed, using localStorage:', error.message);
      }
      
      // Fallback to localStorage
      const savedStreakData = localStorage.getItem('skincareStreakData');
      if (savedStreakData) {
        const parsedData = JSON.parse(savedStreakData);
        setStreakData(parsedData);
        
        // Sync localStorage data to database for future use
        if (user?.uid) {
          try {
            const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
            await fetch(`${apiUrl}/streak/sync/${user.uid}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(parsedData)
            });
            console.log('✅ Synced localStorage streak data to database');
          } catch (syncError) {
            console.log('Failed to sync streak data to database:', syncError.message);
          }
        }
      }
    };
    
    loadStreakData();
  }, [user]);

  // Save streak data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('skincareStreakData', JSON.stringify(streakData));
    calculateStreaks(streakData);
    
    // Update today completed status
    const today = formatDate(new Date());
    setTodayCompleted(!!streakData[today]);
  }, [streakData, calculateStreaks, formatDate]);

  const showCelebration = useCallback(() => {
    // Create celebration effect
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉 Glow meter updated! 💖';
    celebration.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #333;
      padding: 0.75rem 1.5rem;
      border-radius: 15px;
      font-weight: bold;
      font-size: 1rem;
      z-index: 10001;
      animation: celebrationPop 2s ease-out forwards;
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      document.body.removeChild(celebration);
    }, 2000);
  }, []);

  const markTodayComplete = useCallback(async () => {
    if (!user?.uid) return;
    
    const today = formatDate(new Date());
    
    // Update local state immediately for UI responsiveness
    setStreakData(prev => ({
      ...prev,
      [today]: true
    }));
    
    // Update database
    try {
      const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/streak/update/${user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: today })
      });
      
      if (response.ok) {
        console.log('✅ Streak updated in database');
      } else {
        console.log('Failed to update streak in database');
      }
    } catch (error) {
      console.log('Database streak update failed:', error.message);
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('streakUpdated'));
    
    // Show celebration animation
    showCelebration();
  }, [formatDate, showCelebration, user]);

  // Get last 14 days for compact horizontal display
  const getLast14Days = useCallback(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = formatDate(date);
      const hasStreak = streakData[dateStr];
      const isToday = i === 0;
      
      days.push({
        date: date,
        dateStr: dateStr,
        hasStreak: hasStreak,
        isToday: isToday,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate()
      });
    }
    
    return days;
  }, [streakData, formatDate]);

  const last14Days = getLast14Days();

  // Calculate popup position relative to anchor
  const getPopupStyle = () => {
    if (!anchorRef?.current) return {};
    
    const rect = anchorRef.current.getBoundingClientRect();
    const popupWidth = window.innerWidth <= 480 ? Math.min(320, window.innerWidth - 20) : 400;
    
    // Position popup to the right of the button, but ensure it stays within viewport
    let left = rect.left - (popupWidth / 2) + (rect.width / 2);
    
    // Ensure popup doesn't go off screen
    if (left < 10) left = 10;
    if (left + popupWidth > window.innerWidth - 10) {
      left = window.innerWidth - popupWidth - 10;
    }
    
    return {
      position: 'fixed',
      top: rect.bottom + 15,
      left: left,
      zIndex: 1000
    };
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="navbar-streak-overlay" onClick={onClose}></div>
      <div className="navbar-streak-popup" style={getPopupStyle()}>
        <div className="navbar-streak-header">
          <h3>💖 Your Glow meter</h3>
          <button className="navbar-streak-close" onClick={onClose}>×</button>
        </div>

        <div className="navbar-streak-stats">
          <div className="navbar-stat">
            <span className="navbar-stat-number">{currentStreak}</span>
            <span className="navbar-stat-label">Current</span>
          </div>
          <div className="navbar-stat">
            <span className="navbar-stat-number">{longestStreak}</span>
            <span className="navbar-stat-label">Best</span>
          </div>
          <div className="navbar-stat">
            <span className="navbar-stat-number">{Object.keys(streakData).length}</span>
            <span className="navbar-stat-label">Total</span>
          </div>
        </div>

        <div className="navbar-timeline">
          <div className="navbar-timeline-track">
            {last14Days.map((day, index) => (
              <div 
                key={day.dateStr}
                className={`navbar-timeline-dot ${day.hasStreak ? 'completed' : 'incomplete'} ${day.isToday ? 'today' : ''}`}
                title={`${day.dayName} ${day.dayNumber} - ${day.hasStreak ? 'Completed' : 'Not completed'}`}
              >
                <div className="navbar-dot-indicator">
                  {day.hasStreak ? (
                    <span className="navbar-heart-emoji">💖</span>
                  ) : (
                    <div className="navbar-empty-dot"></div>
                  )}
                </div>
                <div className="navbar-dot-date">
                  <span className="navbar-dot-day">{day.dayName.charAt(0)}</span>
                  <span className="navbar-dot-number">{day.dayNumber}</span>
                </div>
                {index < last14Days.length - 1 && (
                  <div className={`navbar-timeline-connector ${day.hasStreak && last14Days[index + 1]?.hasStreak ? 'active' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={markTodayComplete} 
          className={`navbar-complete-btn ${todayCompleted ? 'completed' : ''}`}
          disabled={todayCompleted}
        >
          {todayCompleted ? (
            <>✅ Today Complete!</>
          ) : (
            <>✨ Complete Today</>
          )}
        </button>
      </div>
    </>
  );
};

export default NavbarStreakPopup;