import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to calculate age from birthdate
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Update age when birthdate changes
  useEffect(() => {
    if (birthDate) {
      setAge(calculateAge(birthDate));
    }
  }, [birthDate]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || '');
      setUserEmail(user.email || '');
      // You can extend this to load birthdate and gender from user metadata
      // For now, we'll start with empty values
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const user = auth.currentUser;
    if (!user) {
      setError('No user is logged in.');
      return;
    }

    try {
      // Update display name
      if (userName !== user.displayName) {
        await updateProfile(user, { displayName: userName });
        setMessage('Profile updated successfully!');
      }

      // Update email
      if (userEmail !== user.email) {
        await updateEmail(user, userEmail);
        setMessage('Email updated successfully! Please re-login to verify.');
      }

      // Update password with current password verification
      if (newPassword) {
        if (!currentPassword) {
          setError('Current password is required to change password.');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          setError('New passwords do not match.');
          return;
        }

        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        setMessage('Password updated successfully! Please re-login.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      
      if (!message && !error) {
        setMessage('No changes to save.');
      }

    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect.');
      } else if (err.code === 'auth/weak-password') {
        setError('New password is too weak. Please choose a stronger password.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleReturnHome = () => {
    navigate('/home');
  };

  return (
    <div className="profile-settings-container">
      <h2>Profile Settings</h2>
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Your Email"
          />
        </div>
        <div className="form-group">
          <label>Birth Date:</label>
          <input 
            type="date" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        {age && (
          <div className="form-group">
            <label>Age:</label>
            <input 
              type="text" 
              value={`${age} years old`}
              readOnly
              className="readonly-input"
            />
          </div>
        )}
        <div className="form-group">
          <label>Gender:</label>
          <select 
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password:</label>
          <input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
          />
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleReturnHome} className="return-home-btn">
            Return Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 