import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../firebase"; // Assuming you have firebase imported for auth
import { signOut, onAuthStateChanged } from "firebase/auth";
import NavbarStreakPopup from "./NavbarStreakPopup";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("Guest"); // Default to Guest
  const [currentStreak, setCurrentStreak] = useState(0);
  const navigate = useNavigate();
  const streakButtonRef = useRef(null);

  const currentPlan = "Premium Skincare"; // Placeholder for current plan

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUserName(user.displayName || user.email);
      } else {
        // User is signed out
        setCurrentUserName("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  // Load and calculate current streak
  useEffect(() => {
    const calculateCurrentStreak = async () => {
      if (!user?.uid) return;
      
      try {
        // First, try to load from database
        const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/streak/stats/${user.uid}`);
        
        if (response.ok) {
          const stats = await response.json();
          setCurrentStreak(stats.current_streak);
          console.log('✅ Streak loaded from database:', stats);
          return;
        }
      } catch (error) {
        console.log('Database streak load failed, using localStorage:', error.message);
      }
      
      // Fallback to localStorage calculation
      const savedStreakData = localStorage.getItem('skincareStreakData');
      if (savedStreakData) {
        const parsedData = JSON.parse(savedStreakData);
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        let current = 0;
        
        // Calculate current streak (must include today or yesterday)
        if (parsedData[todayStr] || parsedData[yesterdayStr]) {
          let checkDate = parsedData[todayStr] ? today : new Date(today.getTime() - 24 * 60 * 60 * 1000);
          
          while (parsedData[checkDate.toISOString().split('T')[0]]) {
            current++;
            checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
          }
        }

        setCurrentStreak(current);
      }
    };

    calculateCurrentStreak();

    // Listen for streak updates
    const handleStreakUpdate = () => {
      calculateCurrentStreak();
    };

    window.addEventListener('streakUpdated', handleStreakUpdate);
    window.addEventListener('storage', handleStreakUpdate);

    return () => {
      window.removeEventListener('streakUpdated', handleStreakUpdate);
      window.removeEventListener('storage', handleStreakUpdate);
    };
  }, [user]);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
    setShowStreakPopup(false); // Close streak popup when profile is opened
  };

  const handleStreakClick = () => {
    setShowStreakPopup(!showStreakPopup);
    setShowDropdown(false); // Close profile dropdown when streak is opened
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleManageSubscription = () => {
    // Navigate to a subscription management page
    navigate("/manage-subscription");
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">HOME<span>•</span></div>
      <ul>
        <li className="active">Welcome</li>
        <li><Link to="/skin-essentials">Skin Essentials</Link></li>
        <li><Link to="/diy-remedies">DIY Remedies</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li 
          ref={streakButtonRef}
          className="streak-nav-item" 
          onClick={handleStreakClick}
        >
          <span className="streak-heart">💖</span>
          <span className="streak-count">{currentStreak}</span>
        </li>
        <li className="profile-icon" onClick={handleProfileClick}>
          <div className="profile-circle">
            <i className="fas fa-user"></i>
          </div>
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="hello-user">Hello, {currentUserName}!</p>
                <p className="current-plan-label">CURRENT PLAN</p>
                <p className="current-plan-name">{currentPlan}</p>
                <button className="upgrade-btn" onClick={handleManageSubscription}>Manage Subscription</button>
              </div>
              <ul className="dropdown-links">
                <li>
                  <Link to="/profile-settings" onClick={() => setShowDropdown(false)}>
                    Manage account
                  </Link>
                </li>
                <li>
                  <Link to="/my-skin-reports" onClick={() => setShowDropdown(false)}>
                    My Skin Reports
                  </Link>
                </li>
                <li>
                  <Link to="/help-support" onClick={() => setShowDropdown(false)}>
                    Help & Support
                  </Link>
                </li>
              </ul>
              <div className="dropdown-footer">
                <button onClick={handleLogout} className="logout-btn">
                  Log out <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          )}
        </li>
      </ul>
      
      {/* Streak Popup */}
      <NavbarStreakPopup 
        isOpen={showStreakPopup} 
        onClose={() => setShowStreakPopup(false)}
        anchorRef={streakButtonRef}
      />
    </nav>
  );
};

export default Navbar;
