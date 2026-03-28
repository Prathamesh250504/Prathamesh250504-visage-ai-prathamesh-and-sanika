import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import './SkinReports.css';

const SkinReports = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [finalReports, setFinalReports] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'quiz', or 'final'

  // Load user's analysis and quiz history from MongoDB API
  const loadUserData = useCallback(async (currentUser) => {
    if (!currentUser) return;
    
    setLoadingHistory(true);
    try {
      const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
      
      // Automatically sync user statistics first to ensure accuracy
      try {
        console.log('Auto-syncing user statistics...');
        const syncResponse = await fetch(`${apiUrl}/user/${currentUser.uid}/stats/sync`);
        if (syncResponse.ok) {
          const syncResult = await syncResponse.json();
          console.log('✅ Stats auto-synced:', syncResult);
          setUserStats({
            total_analyses: syncResult.total_analyses,
            total_quizzes: syncResult.total_quizzes,
            last_analysis: syncResult.last_analysis,
            last_quiz: syncResult.last_quiz
          });
        } else {
          // Fallback to regular stats if sync fails
          console.log('Sync failed, falling back to stored stats');
          const statsResponse = await fetch(`${apiUrl}/user/${currentUser.uid}/stats`);
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setUserStats(stats);
          }
        }
      } catch (error) {
        console.log('Auto-sync failed, trying regular stats:', error.message);
        // Fallback to regular stats endpoint
        try {
          const statsResponse = await fetch(`${apiUrl}/user/${currentUser.uid}/stats`);
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setUserStats(stats);
          }
        } catch (fallbackError) {
          console.log('Stats API not available:', fallbackError.message);
        }
      }

      // Load analysis history from MongoDB
      try {
        const historyResponse = await fetch(`${apiUrl}/user/${currentUser.uid}/history?limit=20`);
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          const analyses = historyData.analyses || [];
          
          // Transform MongoDB data to match our component format
          const transformedAnalyses = analyses.map(analysis => ({
            id: analysis._id,
            date: analysis.timestamp,
            userId: analysis.user_id,
            skinType: {
              skinType: analysis.skin_type?.prediction || 'N/A',
              confidence: Math.round((analysis.skin_type?.confidence || 0) * 100)
            },
            skinTone: {
              tone: analysis.skin_tone?.prediction || 'N/A',
              confidence: Math.round((analysis.skin_tone?.confidence || 0) * 100)
            },
            acne: {
              severity: analysis.skin_condition?.prediction === 'Acne' ? 'Moderate' : 'None',
              confidence: Math.round((analysis.skin_condition?.confidence || 0) * 100)
            },
            pigmentation: {
              severity: 'None', // Will be updated when pigmentation model is integrated
              confidence: 0
            },
            pores: {
              severity: 'None', // Will be updated when pores model is integrated
              confidence: 0
            },
            darkCircles: {
              severity: 'None', // Will be updated when dark circles model is integrated
              confidence: 0
            },
            overallHealthScore: calculateHealthScore(analysis)
          }));
          
          setAnalysisHistory(transformedAnalyses);
        }
      } catch (error) {
        console.log('Analysis history API not available, trying localStorage:', error.message);
        
        // Fallback to localStorage
        const localReports = localStorage.getItem(`skinReports_${currentUser.uid}`);
        if (localReports) {
          const reports = JSON.parse(localReports);
          setAnalysisHistory(reports);
        }
      }

      // Load quiz history from MongoDB
      try {
        const quizResponse = await fetch(`${apiUrl}/quiz/history/${currentUser.uid}?limit=20`);
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          setQuizHistory(quizData.quizzes || []);
        }
      } catch (error) {
        console.log('Quiz history API not available, trying localStorage:', error.message);
        
        // Fallback to localStorage
        const localQuizHistory = localStorage.getItem(`quizHistory_${currentUser.uid}`);
        if (localQuizHistory) {
          const quizzes = JSON.parse(localQuizHistory);
          setQuizHistory(quizzes);
        }
      }

      // Load final reports from MongoDB
      try {
        const finalResponse = await fetch(`${apiUrl}/final-report/history/${currentUser.uid}?limit=10`);
        if (finalResponse.ok) {
          const finalData = await finalResponse.json();
          setFinalReports(finalData.reports || []);
        }
      } catch (error) {
        console.log('Final reports API not available, trying localStorage:', error.message);
        
        // Fallback to localStorage
        const existingFinalReports = localStorage.getItem(`finalReports_${currentUser.uid}`);
        if (existingFinalReports) {
          const reports = JSON.parse(existingFinalReports);
          setFinalReports(reports);
        }
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Helper function to calculate health score from MongoDB analysis data
  const calculateHealthScore = (analysis) => {
    let score = 100;
    
    // Deduct points based on skin conditions
    const condition = analysis.skin_condition?.prediction;
    if (condition === 'Acne') score -= 20;
    if (condition === 'Rosacea') score -= 15;
    if (condition === 'Keratosis') score -= 25;
    if (condition === 'Melanoma') score -= 40;
    if (condition === 'Eczema') score -= 15;
    
    // Deduct points based on Dark.h5 model predictions (if available)
    if (analysis.pores?.prediction === 'Severe') score -= 15;
    if (analysis.pores?.prediction === 'Moderate') score -= 10;
    if (analysis.pores?.prediction === 'Mild') score -= 5;
    
    if (analysis.pigmentation?.prediction === 'Severe') score -= 20;
    if (analysis.pigmentation?.prediction === 'Moderate') score -= 12;
    if (analysis.pigmentation?.prediction === 'Mild') score -= 6;
    
    if (analysis.darkcircles?.prediction === 'Severe') score -= 15;
    if (analysis.darkcircles?.prediction === 'Moderate') score -= 10;
    if (analysis.darkcircles?.prediction === 'Mild') score -= 5;
    
    // Adjust based on confidence levels
    const confidenceValues = [
      analysis.skin_condition?.confidence || 0,
      analysis.skin_tone?.confidence || 0,
      analysis.skin_type?.confidence || 0,
      analysis.pores?.confidence || 0,
      analysis.pigmentation?.confidence || 0,
      analysis.darkcircles?.confidence || 0
    ].filter(val => val > 0);
    
    const avgConfidence = confidenceValues.length > 0 
      ? confidenceValues.reduce((sum, val) => sum + val, 0) / confidenceValues.length
      : 0.5;
    
    score = Math.max(30, Math.min(100, score * avgConfidence));
    
    return Math.round(score);
  };

  // Load final reports from localStorage
  useEffect(() => {
    if (user) {
      const existingFinalReports = localStorage.getItem(`finalReports_${user.uid}`);
      if (existingFinalReports) {
        const reports = JSON.parse(existingFinalReports);
        setFinalReports(reports);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && !loading) {
      loadUserData(user);
    }
  }, [user, loading, loadUserData]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const generateFinalReport = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
      
      // Try to generate report using MongoDB API
      try {
        const response = await fetch(`${apiUrl}/final-report/generate/${user.uid}`, {
          method: 'POST'
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Final report generated:', result);
          
          // Reload data to show new report
          loadUserData(user);
          alert('Final report generated successfully!');
          return;
        }
      } catch (apiError) {
        console.log('API not available, generating local report:', apiError.message);
      }
      
      // Fallback: Generate a simple final report locally
      const reportId = Date.now().toString();
      const report = {
        id: reportId,
        timestamp: new Date().toISOString(),
        userId: user.uid,
        analysisCount: analysisHistory.length,
        quizCount: quizHistory.length,
        recommendations: [
          "Continue with your current skincare routine",
          "Use sunscreen daily for protection",
          "Stay hydrated and maintain a healthy diet",
          "Consider professional consultation for specific concerns"
        ],
        skincare_routine: {
          morning: [
            "Gentle cleanser",
            "Moisturizer",
            "Sunscreen SPF 30+"
          ],
          evening: [
            "Cleanser",
            "Treatment (if needed)",
            "Night moisturizer"
          ],
          weekly: [
            "Gentle exfoliation",
            "Face mask"
          ]
        }
      };
      
      // Add to final reports
      setFinalReports(prev => [report, ...prev]);
      
      // Save to localStorage as backup
      const existingFinalReports = localStorage.getItem(`finalReports_${user.uid}`);
      const reports = existingFinalReports ? JSON.parse(existingFinalReports) : [];
      reports.unshift(report);
      localStorage.setItem(`finalReports_${user.uid}`, JSON.stringify(reports));
      
      alert('Final report generated successfully!');
    } catch (error) {
      console.error('Error generating final report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="skin-reports-container">
      <div className="reports-header">
        <button className="back-btn" onClick={handleBackToHome}>
          ← Back to Home
        </button>
        <h1>📊 My Skin Reports</h1>
        <p>Track your skincare journey and progress</p>
      </div>

      {/* User Statistics Card */}
      {userStats && (
        <div className="stats-card">
          <h2>Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🔬</span>
              <div className="stat-content">
                <span className="stat-label">Total Analyses</span>
                <span className="stat-value">{userStats.total_analyses}</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📝</span>
              <div className="stat-content">
                <span className="stat-label">Total Quizzes</span>
                <span className="stat-value">{userStats.total_quizzes || 0}</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📅</span>
              <div className="stat-content">
                <span className="stat-label">Last Analysis</span>
                <span className="stat-value-small">
                  {userStats.last_analysis ? formatDate(userStats.last_analysis) : 'Never'}
                </span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <div className="stat-content">
                <span className="stat-label">Last Quiz</span>
                <span className="stat-value-small">
                  {userStats.last_quiz ? formatDate(userStats.last_quiz) : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          🔬 Analysis History
        </button>
        <button 
          className={`tab-button ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          📝 Quiz History
        </button>
        <button 
          className={`tab-button ${activeTab === 'final' ? 'active' : ''}`}
          onClick={() => setActiveTab('final')}
        >
          📊 Final Reports
        </button>
      </div>

      {/* Analysis History Tab */}
      {activeTab === 'analysis' && (
        <div className="history-section">
          <h2>Facial Analysis History</h2>
          {loadingHistory ? (
            <p className="loading-text">Loading history...</p>
          ) : analysisHistory.length > 0 ? (
            <div className="history-items">
              {analysisHistory.map((analysis, index) => (
                <div key={analysis.id || index} className="history-card">
                  <div className="card-header">
                    <span className="card-date">{formatDate(analysis.date || analysis.timestamp)}</span>
                  </div>
                  <div className="card-content">
                    <div className="analysis-row">
                      <strong>Skin Type:</strong>
                      <span className="badge">{analysis.skinType?.skinType || 'N/A'}</span>
                      <span className="confidence">
                        {analysis.skinType?.confidence || 0}%
                      </span>
                    </div>
                    <div className="analysis-row">
                      <strong>Skin Tone:</strong>
                      <span className="badge">{analysis.skinTone?.tone || 'N/A'}</span>
                      <span className="confidence">
                        {analysis.skinTone?.confidence || 0}%
                      </span>
                    </div>
                    <div className="analysis-row">
                      <strong>Overall Health:</strong>
                      <span className="badge">{analysis.overallHealthScore || 'N/A'}</span>
                    </div>
                    <div className="analysis-row">
                      <strong>Acne:</strong>
                      <span className={`badge ${analysis.acne?.severity === 'None' ? '' : 'badge-warning'}`}>
                        {analysis.acne?.severity || 'N/A'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <strong>Pigmentation:</strong>
                      <span className={`badge ${analysis.pigmentation?.severity === 'None' ? '' : 'badge-warning'}`}>
                        {analysis.pigmentation?.severity || 'N/A'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <strong>Pores:</strong>
                      <span className={`badge ${analysis.pores?.severity === 'None' ? '' : 'badge-warning'}`}>
                        {analysis.pores?.severity || 'N/A'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <strong>Dark Circles:</strong>
                      <span className={`badge ${analysis.darkCircles?.severity === 'None' ? '' : 'badge-warning'}`}>
                        {analysis.darkCircles?.severity || 'N/A'}
                      </span>
                    </div>
                    {analysis.capturedImage && (
                      <div className="analysis-image">
                        <img src={analysis.capturedImage} alt="Analysis" style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginTop: '10px'
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🔬</span>
              <p>No analysis history yet.</p>
              <p>Complete a facial analysis to see your history here!</p>
              <button onClick={() => navigate('/facial-analysis')} className="action-btn">
                Start Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz History Tab */}
      {activeTab === 'quiz' && (
        <div className="history-section">
          <h2>Quiz History</h2>
          {loadingHistory ? (
            <p className="loading-text">Loading quiz history...</p>
          ) : quizHistory.length > 0 ? (
            <div className="history-items">
              {quizHistory.map((quiz) => (
                <div key={quiz._id} className="history-card">
                  <div className="card-header">
                    <span className="card-date">{formatDate(quiz.timestamp)}</span>
                  </div>
                  <div className="card-content">
                    <div className="quiz-row">
                      <strong>Skin Type:</strong>
                      <span>{quiz.skinType || quiz.skin_type || 'N/A'}</span>
                    </div>
                    <div className="quiz-row">
                      <strong>Age:</strong>
                      <span>{quiz.age || 'N/A'}</span>
                    </div>
                    <div className="quiz-row">
                      <strong>Primary Concern:</strong>
                      <span>{quiz.concern || 'N/A'}</span>
                    </div>
                    <div className="quiz-row">
                      <strong>Breakouts:</strong>
                      <span>{quiz.breakouts || 'N/A'}</span>
                    </div>
                    <div className="quiz-row">
                      <strong>Sunscreen Usage:</strong>
                      <span>{quiz.sunscreen || 'N/A'}</span>
                    </div>
                    <div className="quiz-row">
                      <strong>Water Intake:</strong>
                      <span>{quiz.waterIntake || quiz.water_intake || 'N/A'}</span>
                    </div>
                    <div className="quiz-row">
                      <strong>Sleep:</strong>
                      <span>{quiz.sleep || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No quiz history yet.</p>
              <p>Take the skincare quiz to get personalized recommendations!</p>
              <button onClick={() => navigate('/quiz')} className="action-btn">
                Take Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Final Reports Tab */}
      {activeTab === 'final' && (
        <div className="history-section">
          <div className="final-report-header">
            <h2>Final Combined Reports</h2>
            <button onClick={generateFinalReport} className="generate-btn" disabled={loadingHistory}>
              {loadingHistory ? '⏳ Generating...' : '✨ Generate New Report'}
            </button>
          </div>
          <p className="report-description">
            Final reports combine your facial analysis and quiz data to provide comprehensive skincare recommendations.
          </p>
          
          {loadingHistory ? (
            <p className="loading-text">Loading reports...</p>
          ) : finalReports.length > 0 ? (
            <div className="history-items">
              {finalReports.map((report) => (
                <div key={report.id || report._id} className="final-report-card">
                  <div className="card-header">
                    <span className="card-date">{formatDate(report.timestamp)}</span>
                    <span className="report-badge">Combined Report</span>
                  </div>
                  
                  <div className="report-section">
                    <h3>📊 Analysis Summary</h3>
                    <div className="report-grid">
                      <div className="report-item">
                        <strong>Total Analyses:</strong>
                        <span>{report.analysisCount || userStats?.total_analyses || 0}</span>
                      </div>
                      <div className="report-item">
                        <strong>Total Quizzes:</strong>
                        <span>{report.quizCount || userStats?.total_quizzes || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis Results */}
                  {report.skin_condition && (
                    <div className="report-section analysis-details">
                      <h3>🔬 Latest Analysis Results</h3>
                      <div className="analysis-grid">
                        <div className="analysis-item">
                          <strong>Skin Condition:</strong>
                          <span className={`badge ${report.skin_condition.prediction === 'Normal' ? '' : 'badge-warning'}`}>
                            {report.skin_condition.prediction || 'N/A'}
                          </span>
                          <span className="confidence">{Math.round((report.skin_condition.confidence || 0) * 100)}%</span>
                        </div>
                        <div className="analysis-item">
                          <strong>Skin Tone:</strong>
                          <span className="badge">{report.skin_tone?.prediction || 'N/A'}</span>
                          <span className="confidence">{Math.round((report.skin_tone?.confidence || 0) * 100)}%</span>
                        </div>
                        <div className="analysis-item">
                          <strong>Skin Type:</strong>
                          <span className="badge">{report.skin_type?.prediction || 'N/A'}</span>
                          <span className="confidence">{Math.round((report.skin_type?.confidence || 0) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quiz Results */}
                  {report.quiz_answers && (
                    <div className="report-section quiz-details">
                      <h3>📝 Latest Quiz Results</h3>
                      <div className="quiz-grid">
                        <div className="quiz-item">
                          <strong>Age:</strong>
                          <span>{report.quiz_answers.age || 'N/A'}</span>
                        </div>
                        <div className="quiz-item">
                          <strong>Primary Concern:</strong>
                          <span>{report.quiz_answers.concern || 'N/A'}</span>
                        </div>
                        <div className="quiz-item">
                          <strong>Skin Type (Quiz):</strong>
                          <span>{report.quiz_answers.skinType || report.quiz_answers.skin_type || 'N/A'}</span>
                        </div>
                        <div className="quiz-item">
                          <strong>Sunscreen Usage:</strong>
                          <span>{report.quiz_answers.sunscreen || 'N/A'}</span>
                        </div>
                        <div className="quiz-item">
                          <strong>Water Intake:</strong>
                          <span>{report.quiz_answers.waterIntake || report.quiz_answers.water_intake || 'N/A'}</span>
                        </div>
                        <div className="quiz-item">
                          <strong>Sleep Quality:</strong>
                          <span>{report.quiz_answers.sleep || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="report-section recommendations-section">
                    <h3>💡 Personalized Recommendations</h3>
                    <ul className="recommendations-list">
                      {(report.recommendations || [
                        "Continue with your current skincare routine",
                        "Use sunscreen daily for protection",
                        "Stay hydrated and maintain a healthy diet",
                        "Consider professional consultation for specific concerns"
                      ]).map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="report-section routine-section">
                    <h3>🌅 Your Personalized Skincare Routine</h3>
                    <div className="routine-grid">
                      <div className="routine-column">
                        <h4>🌅 Morning</h4>
                        <ol>
                          {(report.skincare_routine?.morning || [
                            "Gentle cleanser",
                            "Moisturizer",
                            "Sunscreen SPF 30+"
                          ]).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="routine-column">
                        <h4>🌙 Evening</h4>
                        <ol>
                          {(report.skincare_routine?.evening || [
                            "Cleanser",
                            "Treatment (if needed)",
                            "Night moisturizer"
                          ]).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="routine-column">
                        <h4>📅 Weekly</h4>
                        <ol>
                          {(report.skincare_routine?.weekly || [
                            "Gentle exfoliation",
                            "Face mask"
                          ]).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Overall Health Score if available */}
                  {(report.overall_health_score || (report.skin_condition && calculateHealthScore({
                    skin_condition: report.skin_condition,
                    skin_tone: report.skin_tone,
                    skin_type: report.skin_type
                  }))) && (
                    <div className="report-section health-score">
                      <h3>🎯 Overall Skin Health Score</h3>
                      <div className="health-score-display">
                        <span className="score-number">
                          {report.overall_health_score || calculateHealthScore({
                            skin_condition: report.skin_condition,
                            skin_tone: report.skin_tone,
                            skin_type: report.skin_type
                          })}
                        </span>
                        <span className="score-label">/ 100</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>No final reports yet.</p>
              <p>Generate a comprehensive report combining your analysis and quiz data!</p>
              <button onClick={generateFinalReport} className="action-btn">
                Generate First Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkinReports;
