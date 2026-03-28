import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase'; // Updated path to point to the correct location
import './AuthPage.css';

const AuthPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isForgotVisible, setIsForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUpClick = () => setIsRightPanelActive(true);
  const handleSignInClick = () => setIsRightPanelActive(false);
  const handleForgotClick = () => setIsForgotVisible(true);
  const handleCloseForgot = () => {
    setIsForgotVisible(false);
    setResetMessage('');
    setResetEmail('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset link has been sent to your email');
      setTimeout(() => {
        handleCloseForgot();
      }, 3000);
    } catch (error) {
      setResetMessage(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>Enter your details for registration</span>
            <div className="account-input">
              <i className="far fa-user"></i>
              <input type="text" placeholder="Name" required />
            </div>
            <div className="account-input">
              <i className="far fa-envelope"></i>
              <input type="email" placeholder="Email" required />
            </div>
            <div className="account-input">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" className="mt-3">Sign Up</button>
            <div className="divider">
              <span>OR</span>
            </div>
            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Sign up with Google
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            {isForgotVisible && (
              <div id="forgot">
                <div className="enter-email">
                  <div className="enter-email-detail">
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a password reset link</p>
                    <div className="account-input">
                      <i className="far fa-envelope"></i>
                      <input 
                        type="email" 
                        placeholder="Email" 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>
                    {resetMessage && (
                      <p className={`reset-message ${resetMessage.includes('sent') ? 'success' : 'error'}`}>
                        {resetMessage}
                      </p>
                    )}
                    <div>
                      <button type="button" className="signIn-form-button" onClick={handleResetPassword}>
                        Send Reset Link
                      </button>
                      <p id="slideup" style={{ cursor: 'pointer' }} onClick={handleCloseForgot}><u>Back to Sign In</u></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <h1>Sign in to Visage AI</h1>
            <span>Enter your account details</span>
            <div className="account-input">
              <i className="far fa-envelope"></i>
              <input type="email" placeholder="Email" required />
            </div>
            <div className="account-input">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" required />
            </div>
            <p className="forgot" onClick={handleForgotClick}>Forgot your password?</p>
            <button type="submit" className="signIn-form-button">Sign In</button>
            <div className="divider">
              <span>OR</span>
            </div>
            <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Sign in with Google
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="square"></div>
            <div className="triangle"></div>
            <div className="circle"></div>
            <div className="square2"></div>
            <div className="triangle2"></div>

            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handleSignInClick}>Sign In</button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
