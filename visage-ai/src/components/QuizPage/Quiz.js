import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import styles from "./Quiz.module.css";
import { questions, generateAnalysis } from "./quizLogic";

const Quiz = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return; // Don't initialize quiz if user is not authenticated

    const script = document.createElement("script");
    script.src = "/quizLogic.js"; // optional if you externalize logic
    script.async = true;
    return () => {
      // Cleanup DOM or listeners if needed
    };
  }, [user]);

  // Save quiz data to MongoDB Atlas (background process)
  const saveQuizToDatabase = useCallback(async (quizData, analysis) => {
    if (!user) return;

    try {
      const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
      
      // Include the generated analysis in the quiz data
      const quizDataWithAnalysis = {
        ...quizData,
        analysis: analysis
      };
      
      const response = await fetch(`${apiUrl}/quiz/save?user_id=${encodeURIComponent(user.uid)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizDataWithAnalysis)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Quiz saved to database:', result);
        
        // Also save to localStorage as backup
        const existingQuizzes = localStorage.getItem(`quizHistory_${user.uid}`);
        const quizzes = existingQuizzes ? JSON.parse(existingQuizzes) : [];
        
        const quizRecord = {
          id: result.quiz_id,
          timestamp: new Date().toISOString(),
          userId: user.uid,
          userEmail: user.email,
          ...quizDataWithAnalysis
        };
        
        quizzes.unshift(quizRecord);
        
        // Keep only last 20 quizzes
        if (quizzes.length > 20) {
          quizzes.splice(20);
        }
        
        localStorage.setItem(`quizHistory_${user.uid}`, JSON.stringify(quizzes));
        
        return result;
      } else {
        console.error('Failed to save quiz to database');
        throw new Error('Failed to save quiz');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      
      // Save to localStorage as fallback
      try {
        const existingQuizzes = localStorage.getItem(`quizHistory_${user.uid}`);
        const quizzes = existingQuizzes ? JSON.parse(existingQuizzes) : [];
        
        const quizRecord = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          userId: user.uid,
          userEmail: user.email,
          ...quizData,
          analysis: analysis,
          savedToDatabase: false
        };
        
        quizzes.unshift(quizRecord);
        localStorage.setItem(`quizHistory_${user.uid}`, JSON.stringify(quizzes));
        
        console.log('Quiz saved to localStorage as fallback');
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError);
      }
      
      throw error;
    }
  }, [user]);

  // Handle back to home
  const handleBackToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    if (!user) return;

    let currentQuestion = 0;
    const container = document.getElementById("questionContainer");
    const responses = [];

    const showQuestion = (index) => {
      const q = questions[index];
      const imageHTML = q.images?.length
        ? `<div class="${styles.imageRow}">
              ${q.images.map(src => `<img src="${src}" alt="illustration">`).join('')}
           </div>`
        : "";

      let inputHTML = "";
      if (Array.isArray(q.input)) {
        inputHTML = `<div class="${styles.options}">
            ${q.input.map(opt => `<div class="${styles.optionButton}" data-value="${opt}">${opt}</div>`).join('')}
          </div>
          <input type="hidden" name="${q.name}" id="hiddenInput">`;
      } else if (q.type === "number") {
        inputHTML = `<input type="number" name="${q.name}" placeholder="Enter your ${q.name}">`;
      } else {
        inputHTML = `<input type="text" name="${q.name}" placeholder="Enter your ${q.name}">`;
      }

      container.innerHTML = `
        <h2>${q.title}</h2>
        <p class="${styles.description}">${q.desc}</p>
        <div class="${styles.explanation}">${q.explanation}</div>
        ${imageHTML}
        <form id="qForm">
          ${inputHTML}
          <button type="submit">${index === questions.length - 1 ? "Finish" : "Next"}</button>
        </form>
      `;

      const buttons = document.querySelectorAll(`.${styles.optionButton}`);
      const hiddenInput = document.getElementById("hiddenInput");

      buttons.forEach(btn => {
        btn.onclick = () => {
          buttons.forEach(b => b.classList.remove(styles.selected));
          btn.classList.add(styles.selected);
          hiddenInput.value = btn.getAttribute("data-value");
        };
      });

      document.getElementById("qForm").onsubmit = (e) => {
        e.preventDefault();
        if (Array.isArray(q.input) && buttons.length > 0 && !hiddenInput.value) {
          alert("Please select an option before continuing.");
          return;
        } else if (!Array.isArray(q.input)) {
          const val = e.target.elements[q.name].value.trim();
          if (!val) {
            alert("Please enter a valid value.");
            return;
          }
        }

        const formData = new FormData(e.target);
        responses.push(Object.fromEntries(formData.entries()));
        currentQuestion++;
        if (currentQuestion < questions.length) {
          showQuestion(currentQuestion);
        } else {
          showFinal();
        }
      };
    };

    const showFinal = async () => {
      const answers = Object.assign({}, ...responses);
      const analysis = generateAnalysis(answers);
      
      // Show results immediately
      container.innerHTML = `
        <h2>✨ Your Personalized Skin Analysis</h2>
        <div style="line-height: 1.8; font-size: 15px;">${analysis}</div>
        <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 10px; border-left: 4px solid #4caf50;">
          <strong>✅ Results Generated!</strong><br>
          Your personalized skincare analysis is ready. We're saving it to your account in the background.
        </div>
        <br>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.location.reload()" style="background: #f57c00; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; margin: 5px; font-weight: 600; font-size: 14px; transition: background 0.3s;" onmouseover="this.style.background='#ff9800'" onmouseout="this.style.background='#f57c00'">Take Quiz Again</button>
          <button onclick="window.location.href='/my-skin-reports'" style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; margin: 5px; font-weight: 600; font-size: 14px; transition: background 0.3s;" onmouseover="this.style.background='#66bb6a'" onmouseout="this.style.background='#4caf50'">View My Reports</button>
          <button onclick="window.location.href='/home'" style="background: #2196f3; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; margin: 5px; font-weight: 600; font-size: 14px; transition: background 0.3s;" onmouseover="this.style.background='#42a5f5'" onmouseout="this.style.background='#2196f3'">Back to Home</button>
        </div>
      `;
      
      // Save to database in the background (non-blocking)
      setIsSaving(true);
      try {
        await saveQuizToDatabase(answers, analysis);
        console.log('✅ Quiz saved successfully in background');
      } catch (error) {
        console.log('⚠️ Background save failed, but results are still displayed');
      } finally {
        setIsSaving(false);
      }
    };

    showQuestion(currentQuestion);
  }, [user, saveQuizToDatabase]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <button 
              onClick={handleBackToHome}
              className={styles.backButton}
            >
              ← Back to Home
            </button>
            <h2>Loading...</h2>
            <p>Please wait while we load the quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <button 
              onClick={handleBackToHome}
              className={styles.backButton}
            >
              ← Back to Home
            </button>
            <h2>Authentication Required</h2>
            <p>Please log in to take the skincare quiz.</p>
            <button onClick={() => navigate('/auth')} style={{
              background: '#6c5ce7',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Back to Home Button */}
      <button 
        onClick={handleBackToHome}
        className={styles.backButton}
      >
        ← Back to Home
      </button>
      
      <div className={styles.container} id="questionContainer"></div>
      
      {/* Background saving indicator */}
      {isSaving && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(245, 124, 0, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)'
        }}>
          💾 Saving to your account...
        </div>
      )}
    </div>
  );
};

export default Quiz;
