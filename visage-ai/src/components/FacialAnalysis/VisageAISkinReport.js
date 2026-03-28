import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './VisageAISkinReport.css';

const VisageAISkinReport = ({ analysisData, capturedImage, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!analysisData) return null;

  const { skinType, skinTone, acne, pores, pigmentation, darkCircles, overallHealthScore } = analysisData;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'None': '#10b981',
      'Mild': '#f59e0b',
      'Moderate': '#f97316',
      'Severe': '#ef4444'
    };
    return colors[severity] || '#6b7280';
  };

  const renderConfidenceBar = (confidence) => (
    <div className="visage-report-confidence-bar">
      <div 
        className="visage-report-confidence-fill"
        style={{ 
          width: `${confidence}%`,
          backgroundColor: getScoreColor(confidence)
        }}
      />
      <span className="visage-report-confidence-text">{confidence}%</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="visage-report-container"
    >
      <div className="visage-report-header">
        <div>
          <h2 className="visage-report-title">✨ Your Skin Analysis Report</h2>
          <p className="visage-report-subtitle">AI-Powered Comprehensive Analysis</p>
        </div>
        <div className="visage-report-actions">
          <button 
            className="visage-report-btn visage-report-btn-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      <div className="visage-report-content">
        {/* Overall Health Score */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="visage-report-health-score"
        >
          <div className="visage-report-score-circle">
            <svg className="visage-report-score-svg" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={getScoreColor(overallHealthScore)}
                strokeWidth="8"
                strokeDasharray={`${(overallHealthScore / 100) * 339.29} 339.29`}
                strokeDashoffset="84.82"
                transform="rotate(-90 60 60)"
                className="visage-report-score-progress"
              />
            </svg>
            <div className="visage-report-score-value">
              <span className="visage-report-score-number">{overallHealthScore}</span>
              <span className="visage-report-score-label">Health Score</span>
            </div>
          </div>
          <div className="visage-report-score-info">
            <h3>Overall Skin Health</h3>
            <p>
              {overallHealthScore >= 80 
                ? 'Your skin is in excellent condition! Keep up the good skincare routine.'
                : overallHealthScore >= 60
                ? 'Your skin is in good condition with some areas for improvement.'
                : 'Your skin needs attention. Consider following our recommended routine.'}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="visage-report-tabs">
          {['overview', 'details', 'professional', 'recommendations'].map((tab) => (
            <button
              key={tab}
              className={`visage-report-tab ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="visage-report-tab-content">
          {selectedTab === 'overview' && (
            <div className="visage-report-overview">
              <div className="visage-report-image-section">
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Analyzed face" 
                    className="visage-report-image"
                  />
                )}
              </div>

              <div className="visage-report-metrics-grid">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="visage-report-metric-card"
                >
                  <div className="visage-report-metric-icon">🧴</div>
                  <h4>Skin Type</h4>
                  <p className="visage-report-metric-value">{skinType.skinType}</p>
                  {renderConfidenceBar(skinType.confidence)}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="visage-report-metric-card"
                >
                  <div className="visage-report-metric-icon">🌈</div>
                  <h4>Skin Tone</h4>
                  <p className="visage-report-metric-value">{skinTone.tone}</p>
                  <p className="visage-report-metric-detail">{skinTone.undertone}</p>
                  {renderConfidenceBar(skinTone.confidence)}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="visage-report-metric-card"
                >
                  <div className="visage-report-metric-icon">🔴</div>
                  <h4>Acne</h4>
                  <p 
                    className="visage-report-metric-value"
                    style={{ color: getSeverityColor(acne.severity) }}
                  >
                    {acne.severity}
                  </p>
                  {renderConfidenceBar(acne.confidence)}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="visage-report-metric-card"
                >
                  <div className="visage-report-metric-icon">🎨</div>
                  <h4>Pigmentation</h4>
                  <p 
                    className="visage-report-metric-value"
                    style={{ color: getSeverityColor(pigmentation.severity) }}
                  >
                    {pigmentation.severity}
                  </p>
                  {pigmentation.type && <p className="visage-report-metric-detail">{pigmentation.type}</p>}
                  {renderConfidenceBar(pigmentation.confidence)}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="visage-report-metric-card"
                >
                  <div className="visage-report-metric-icon">🕳️</div>
                  <h4>Pores</h4>
                  <p 
                    className="visage-report-metric-value"
                    style={{ color: getSeverityColor(pores.severity) }}
                  >
                    {pores.severity}
                  </p>
                  <p className="visage-report-metric-detail">{pores.size} size</p>
                  {renderConfidenceBar(pores.confidence)}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="visage-report-metric-card"
                >
                  <div className="visage-report-metric-icon">👁️</div>
                  <h4>Dark Circles</h4>
                  <p 
                    className="visage-report-metric-value"
                    style={{ color: getSeverityColor(darkCircles.severity) }}
                  >
                    {darkCircles.severity}
                  </p>
                  <p className="visage-report-metric-detail">{darkCircles.intensity}% intensity</p>
                  {renderConfidenceBar(darkCircles.confidence)}
                </motion.div>
              </div>
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="visage-report-details">
              <div className="visage-report-detail-section">
                <h3>🧴 Skin Type Analysis</h3>
                <div className="visage-report-detail-content">
                  <p><strong>Type:</strong> {skinType.skinType}</p>
                  <p><strong>Oiliness Level:</strong> {skinType.details.oiliness}%</p>
                  <p><strong>Hydration Level:</strong> {skinType.details.hydration}%</p>
                  <p><strong>Sensitivity:</strong> {skinType.details.sensitivity}%</p>
                  <p><strong>Confidence:</strong> {skinType.confidence}%</p>
                </div>
              </div>

              <div className="visage-report-detail-section">
                <h3>🌈 Skin Tone Analysis</h3>
                <div className="visage-report-detail-content">
                  <p><strong>Tone:</strong> {skinTone.tone}</p>
                  <p><strong>Undertone:</strong> {skinTone.undertone}</p>
                  <p><strong>Description:</strong> {skinTone.description}</p>
                  <p><strong>Confidence:</strong> {skinTone.confidence}%</p>
                </div>
              </div>

              <div className="visage-report-detail-section">
                <h3>🔴 Acne Analysis</h3>
                <div className="visage-report-detail-content">
                  <p><strong>Severity:</strong> {acne.severity}</p>
                  <p><strong>Confidence:</strong> {acne.confidence}%</p>
                  {acne.locations && acne.locations.length > 0 && (
                    <p><strong>Locations:</strong> Primarily on cheeks and forehead</p>
                  )}
                </div>
              </div>

              <div className="visage-report-detail-section">
                <h3>🎨 Pigmentation Analysis</h3>
                <div className="visage-report-detail-content">
                  <p><strong>Severity:</strong> {pigmentation.severity}</p>
                  {pigmentation.type && <p><strong>Type:</strong> {pigmentation.type}</p>}
                  <p><strong>Coverage:</strong> {pigmentation.coverage}% of face</p>
                  <p><strong>Confidence:</strong> {pigmentation.confidence}%</p>
                  
                  {pigmentation.details && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#2d3748' }}>📋 Detailed Analysis</h4>
                      <p><strong>Pattern:</strong> {pigmentation.details.pattern}</p>
                      <p><strong>Depth:</strong> {pigmentation.details.depth}</p>
                      <p><strong>Likely Type:</strong> {pigmentation.details.likelyType}</p>
                      <p><strong>Treatment Response:</strong> {pigmentation.details.treatmentResponse}</p>
                      <p><strong>Sun Sensitivity:</strong> {pigmentation.details.sunSensitivity}</p>
                      <p><strong>Expected Improvement:</strong> {pigmentation.details.expectedImprovement}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="visage-report-detail-section">
                <h3>🕳️ Pores Analysis</h3>
                <div className="visage-report-detail-content">
                  <p><strong>Severity:</strong> {pores.severity}</p>
                  <p><strong>Size:</strong> {pores.size}</p>
                  <p><strong>Visibility:</strong> {pores.visibility}%</p>
                  <p><strong>Confidence:</strong> {pores.confidence}%</p>
                  {pores.locations && pores.locations.length > 0 && (
                    <p><strong>Primary Locations:</strong> {pores.locations.join(', ')}</p>
                  )}
                  
                  {pores.details && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#2d3748' }}>📋 Detailed Analysis</h4>
                      <p><strong>Distribution:</strong> {pores.details.distribution}</p>
                      <p><strong>Skin Texture:</strong> {pores.details.texture}</p>
                      <p><strong>Oil Production:</strong> {pores.details.oilProduction}</p>
                      <p><strong>Treatment Priority:</strong> {pores.details.treatmentUrgency}</p>
                      <p><strong>Expected Improvement:</strong> {pores.details.expectedImprovement}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="visage-report-detail-section">
                <h3>👁️ Dark Circles Analysis</h3>
                <div className="visage-report-detail-content">
                  <p><strong>Severity:</strong> {darkCircles.severity}</p>
                  <p><strong>Intensity:</strong> {darkCircles.intensity}%</p>
                  <p><strong>Confidence:</strong> {darkCircles.confidence}%</p>
                  
                  {darkCircles.details && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#2d3748' }}>📋 Detailed Analysis</h4>
                      <p><strong>Type:</strong> {darkCircles.details.type}</p>
                      <p><strong>Likely Cause:</strong> {darkCircles.details.cause}</p>
                      <p><strong>Texture:</strong> {darkCircles.details.texture}</p>
                      <p><strong>Treatment Approach:</strong> {darkCircles.details.treatmentApproach}</p>
                      <p><strong>Lifestyle Recommendations:</strong> {darkCircles.details.lifestyle}</p>
                      <p><strong>Expected Improvement:</strong> {darkCircles.details.expectedImprovement}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'professional' && (
            <div className="visage-report-professional">
              <h3>🏥 Professional Clinical Analysis</h3>
              
              {/* Overall Assessment */}
              <div className="visage-report-detail-section">
                <h4>📊 Overall Skin Assessment</h4>
                <div className="visage-report-detail-content">
                  <p><strong>Health Score:</strong> {overallHealthScore}/100</p>
                  <p><strong>Risk Level:</strong> {overallHealthScore >= 80 ? 'Low' : overallHealthScore >= 60 ? 'Moderate' : 'High'}</p>
                  <p><strong>Primary Concerns:</strong> {
                    [
                      acne.severity !== 'None' ? `Acne (${acne.severity})` : null,
                      pores.severity !== 'None' ? `Pores (${pores.severity})` : null,
                      pigmentation.severity !== 'None' ? `Pigmentation (${pigmentation.severity})` : null,
                      darkCircles.severity !== 'None' ? `Dark Circles (${darkCircles.severity})` : null
                    ].filter(Boolean).join(', ') || 'No significant concerns'
                  }</p>
                  <p><strong>Treatment Priority:</strong> {
                    pigmentation.severity === 'Severe' || acne.severity === 'Severe' ? 'Immediate attention recommended' :
                    pores.severity === 'Severe' || darkCircles.severity === 'Severe' ? 'Professional consultation advised' :
                    'Preventive care and maintenance'
                  }</p>
                </div>
              </div>

              {/* Detailed Clinical Findings */}
              {pigmentation.severity !== 'None' && (
                <div className="visage-report-detail-section">
                  <h4>🎨 Clinical Pigmentation Assessment</h4>
                  <div className="visage-report-detail-content">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p><strong>Clinical Classification:</strong> {pigmentation.details?.likelyType}</p>
                        <p><strong>Morphology:</strong> {pigmentation.details?.pattern}</p>
                        <p><strong>Depth Assessment:</strong> {pigmentation.details?.depth}</p>
                        <p><strong>Coverage Area:</strong> {pigmentation.coverage}% facial involvement</p>
                      </div>
                      <div>
                        <p><strong>Treatment Prognosis:</strong> {pigmentation.details?.treatmentResponse}</p>
                        <p><strong>Photoprotection Need:</strong> {pigmentation.details?.sunSensitivity}</p>
                        <p><strong>Expected Timeline:</strong> {pigmentation.details?.expectedImprovement}</p>
                        <p><strong>Monitoring Required:</strong> {pigmentation.severity === 'Severe' ? 'Monthly' : pigmentation.severity === 'Moderate' ? 'Bi-monthly' : 'Quarterly'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pores.severity !== 'None' && (
                <div className="visage-report-detail-section">
                  <h4>🕳️ Clinical Pore Assessment</h4>
                  <div className="visage-report-detail-content">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p><strong>Sebaceous Activity:</strong> {pores.details?.oilProduction}</p>
                        <p><strong>Pore Distribution:</strong> {pores.details?.distribution}</p>
                        <p><strong>Surface Texture:</strong> {pores.details?.texture}</p>
                        <p><strong>Visibility Index:</strong> {pores.visibility}%</p>
                      </div>
                      <div>
                        <p><strong>Treatment Urgency:</strong> {pores.details?.treatmentUrgency}</p>
                        <p><strong>Intervention Type:</strong> {pores.severity === 'Severe' ? 'Professional procedures' : 'Topical treatments'}</p>
                        <p><strong>Response Timeline:</strong> {pores.details?.expectedImprovement}</p>
                        <p><strong>Maintenance Protocol:</strong> {pores.severity !== 'None' ? 'Regular exfoliation + oil control' : 'Standard cleansing'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {darkCircles.severity !== 'None' && (
                <div className="visage-report-detail-section">
                  <h4>👁️ Clinical Periorbital Assessment</h4>
                  <div className="visage-report-detail-content">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p><strong>Clinical Type:</strong> {darkCircles.details?.type}</p>
                        <p><strong>Etiology:</strong> {darkCircles.details?.cause}</p>
                        <p><strong>Morphological Features:</strong> {darkCircles.details?.texture}</p>
                        <p><strong>Intensity Grade:</strong> {darkCircles.intensity}%</p>
                      </div>
                      <div>
                        <p><strong>Treatment Strategy:</strong> {darkCircles.details?.treatmentApproach}</p>
                        <p><strong>Lifestyle Factors:</strong> {darkCircles.details?.lifestyle}</p>
                        <p><strong>Improvement Timeline:</strong> {darkCircles.details?.expectedImprovement}</p>
                        <p><strong>Adjunct Therapy:</strong> {darkCircles.severity === 'Severe' ? 'Consider dermal fillers/laser' : 'Topical treatments sufficient'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment Protocol */}
              <div className="visage-report-detail-section">
                <h4>💊 Recommended Treatment Protocol</h4>
                <div className="visage-report-detail-content">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <h5>Phase 1: Initial Treatment (0-3 months)</h5>
                      <ul style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        {pigmentation.severity !== 'None' && <li>Vitamin C serum (morning) + SPF 30+</li>}
                        {pores.severity !== 'None' && <li>BHA exfoliant (2-3x/week)</li>}
                        {darkCircles.severity !== 'None' && <li>Caffeine eye cream + sleep optimization</li>}
                        <li>Gentle cleanser + moisturizer (daily)</li>
                      </ul>
                    </div>
                    <div>
                      <h5>Phase 2: Maintenance (3+ months)</h5>
                      <ul style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        {pigmentation.severity === 'Severe' && <li>Consider professional treatments</li>}
                        {pores.severity === 'Severe' && <li>Professional pore treatments</li>}
                        {darkCircles.severity === 'Severe' && <li>Dermatologist consultation</li>}
                        <li>Continue preventive routine</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow-up Schedule */}
              <div className="visage-report-detail-section">
                <h4>📅 Recommended Follow-up Schedule</h4>
                <div className="visage-report-detail-content">
                  <p><strong>Next Assessment:</strong> {
                    Math.max(
                      pigmentation.severity === 'Severe' ? 4 : pigmentation.severity === 'Moderate' ? 8 : 12,
                      pores.severity === 'Severe' ? 6 : pores.severity === 'Moderate' ? 10 : 12,
                      darkCircles.severity === 'Severe' ? 8 : darkCircles.severity === 'Moderate' ? 12 : 16
                    )
                  } weeks</p>
                  <p><strong>Professional Consultation:</strong> {
                    pigmentation.severity === 'Severe' || pores.severity === 'Severe' || darkCircles.severity === 'Severe' 
                      ? 'Recommended within 2-4 weeks' 
                      : 'As needed for concerns'
                  }</p>
                  <p><strong>Progress Photos:</strong> Monthly for first 3 months, then quarterly</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'recommendations' && (
            <div className="visage-report-recommendations">
              <h3>💡 Personalized Recommendations</h3>
              
              <div className="visage-report-recommendation-card">
                <h4>🧴 Cleanser</h4>
                <p>
                  {skinType.skinType === 'Oily' 
                    ? 'Use a gel-based cleanser with salicylic acid to control oil production.'
                    : skinType.skinType === 'Dry'
                    ? 'Use a gentle, hydrating cream cleanser to maintain moisture.'
                    : 'Use a balanced cleanser suitable for combination skin.'}
                </p>
              </div>

              <div className="visage-report-recommendation-card">
                <h4>💎 Serum</h4>
                <p>
                  {acne.severity !== 'None'
                    ? 'Consider a niacinamide or salicylic acid serum to treat acne.'
                    : pigmentation.severity !== 'None'
                    ? 'Use a vitamin C serum to reduce pigmentation and brighten skin.'
                    : 'A hyaluronic acid serum will help maintain hydration.'}
                </p>
              </div>

              <div className="visage-report-recommendation-card">
                <h4>🧈 Moisturizer</h4>
                <p>
                  {skinType.skinType === 'Dry'
                    ? 'Use a rich, emollient moisturizer with ceramides.'
                    : skinType.skinType === 'Oily'
                    ? 'Choose a lightweight, oil-free moisturizer.'
                    : 'A balanced moisturizer will work well for your skin type.'}
                </p>
              </div>

              <div className="visage-report-recommendation-card">
                <h4>☀️ Sunscreen</h4>
                <p>
                  Always use broad-spectrum SPF 30+ sunscreen daily, especially important 
                  {pigmentation.severity !== 'None' ? ' to prevent further pigmentation.' : ' for overall skin protection.'}
                </p>
              </div>

              <div className="visage-report-recommendation-card">
                <h4>🌈 Skin Tone Care</h4>
                <div>
                  {skinTone.recommendations.map((rec, index) => (
                    <p key={index} style={{ margin: '8px 0' }}>• {rec}</p>
                  ))}
                </div>
              </div>

              <div className="visage-report-recommendation-card">
                <h4>🎨 Pigmentation Care</h4>
                <p>
                  {pigmentation.severity === 'Severe'
                    ? 'Use vitamin C serum daily, consider professional treatments like chemical peels or laser therapy.'
                    : pigmentation.severity === 'Moderate'
                    ? 'Regular use of vitamin C serum and niacinamide. Always use SPF 30+ to prevent further pigmentation.'
                    : pigmentation.severity === 'Mild'
                    ? 'Gentle vitamin C serum 2-3 times per week and consistent SPF use will help prevent worsening.'
                    : 'Maintain current routine and use daily SPF to prevent future pigmentation.'}
                </p>
                
                {pigmentation.details && pigmentation.severity !== 'None' && (
                  <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
                    <strong>Detailed Treatment Plan:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                      <li><strong>Morning:</strong> Vitamin C serum + SPF 30+ (non-negotiable)</li>
                      <li><strong>Evening:</strong> {pigmentation.severity === 'Severe' ? 'Retinoid or hydroquinone (as prescribed)' : 'Niacinamide serum'}</li>
                      <li><strong>Weekly:</strong> {pigmentation.severity === 'Severe' ? 'Professional chemical peel consultation' : 'Gentle exfoliation'}</li>
                      <li><strong>Timeline:</strong> {pigmentation.details.expectedImprovement}</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="visage-report-recommendation-card">
                <h4>🕳️ Pore Care</h4>
                <p>
                  {pores.severity === 'Severe'
                    ? 'Use a BHA (salicylic acid) exfoliant 2-3 times per week and consider professional treatments like chemical peels.'
                    : pores.severity === 'Moderate'
                    ? 'Regular use of niacinamide serum and gentle exfoliation with BHA can help minimize pore appearance.'
                    : pores.severity === 'Mild'
                    ? 'Maintain current routine and use a gentle clay mask once a week to keep pores clean.'
                    : 'Your pores are barely visible! Continue with your current gentle skincare routine.'}
                </p>
                
                {pores.details && pores.severity !== 'None' && (
                  <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
                    <strong>Detailed Treatment Plan:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                      <li><strong>Daily:</strong> Oil-free cleanser + niacinamide serum</li>
                      <li><strong>2-3x/week:</strong> BHA exfoliant (salicylic acid 0.5-2%)</li>
                      <li><strong>Weekly:</strong> {pores.severity === 'Severe' ? 'Professional extraction + clay mask' : 'Clay mask for oil control'}</li>
                      <li><strong>Oil Control:</strong> {pores.details.oilProduction} sebaceous activity detected</li>
                      <li><strong>Timeline:</strong> {pores.details.expectedImprovement}</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="visage-report-recommendation-card">
                <h4>👁️ Dark Circles Care</h4>
                <p>
                  {darkCircles.severity === 'Severe'
                    ? 'Consider professional treatments, use eye creams with retinol or peptides, ensure 8+ hours of sleep.'
                    : darkCircles.severity === 'Moderate'
                    ? 'Use eye creams with caffeine or vitamin K, get adequate sleep, and stay well hydrated.'
                    : darkCircles.severity === 'Mild'
                    ? 'Maintain good sleep hygiene and use a gentle eye moisturizer with SPF during the day.'
                    : 'Great! Continue your current routine and maintain healthy sleep patterns.'}
                </p>
                
                {darkCircles.details && darkCircles.severity !== 'None' && (
                  <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
                    <strong>Detailed Treatment Plan:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                      <li><strong>Morning:</strong> Caffeine eye cream + SPF eye protection</li>
                      <li><strong>Evening:</strong> {darkCircles.severity === 'Severe' ? 'Retinol eye cream (start slowly)' : 'Hydrating eye cream with peptides'}</li>
                      <li><strong>Lifestyle:</strong> {darkCircles.details.lifestyle}</li>
                      <li><strong>Type:</strong> {darkCircles.details.type} - {darkCircles.details.cause}</li>
                      <li><strong>Timeline:</strong> {darkCircles.details.expectedImprovement}</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Comprehensive Routine */}
              <div className="visage-report-recommendation-card">
                <h4>📋 Complete Daily Routine</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                  <div>
                    <h5 style={{ fontSize: '14px', marginBottom: '8px' }}>🌅 Morning Routine</h5>
                    <ol style={{ fontSize: '12px', paddingLeft: '15px' }}>
                      <li>Gentle cleanser</li>
                      {pigmentation.severity !== 'None' && <li>Vitamin C serum</li>}
                      {darkCircles.severity !== 'None' && <li>Caffeine eye cream</li>}
                      <li>Moisturizer</li>
                      <li>SPF 30+ (essential)</li>
                    </ol>
                  </div>
                  <div>
                    <h5 style={{ fontSize: '14px', marginBottom: '8px' }}>🌙 Evening Routine</h5>
                    <ol style={{ fontSize: '12px', paddingLeft: '15px' }}>
                      <li>Double cleanse (if wearing makeup)</li>
                      {pores.severity !== 'None' && <li>BHA exfoliant (2-3x/week)</li>}
                      {pigmentation.severity !== 'None' && <li>Niacinamide serum</li>}
                      {darkCircles.severity !== 'None' && <li>Eye treatment</li>}
                      <li>Night moisturizer</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VisageAISkinReport;

