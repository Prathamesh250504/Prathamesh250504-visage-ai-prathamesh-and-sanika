import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import VisageAISkinReport from './VisageAISkinReport';
import ProductRecommendationSystem from './ProductRecommendationSystem';
import styles from "./FacialAnalysis.module.css";

// Import example photos for demonstration
import leftExamplePhoto from '../../assets/left.png';
import frontExamplePhoto from '../../assets/frount.png';
import rightExamplePhoto from '../../assets/right.png';

const FacialAnalysis = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // State management for camera functionality
  const [capturedImages, setCapturedImages] = useState({
    left: null,
    right: null,
    front: null
  });
  const [currentCapture, setCurrentCapture] = useState(null);
  const [stream, setStream] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [skinAnalysisResults, setSkinAnalysisResults] = useState(null);
  const [detailedAnalysisData, setDetailedAnalysisData] = useState(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showAlertMessage('Camera not supported in this browser. Please use Chrome, Firefox or Safari.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera started successfully');
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
          showAlertMessage('Camera error occurred. Please try again.');
        };
        
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      if (error.name === 'NotAllowedError') {
        showAlertMessage('Camera access denied. Please allow camera permissions and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        showAlertMessage('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        showAlertMessage('Camera is already in use by another application.');
      } else {
        showAlertMessage(`Camera error: ${error.message}. Please try again.`);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCurrentCapture(null);
  }, [stream]);

  // Capture image for specific angle
  const captureImage = async (angle) => {
    if (!videoRef.current || !canvasRef.current) {
      showAlertMessage('Camera not ready. Please try again.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      showAlertMessage('Camera is still loading. Please wait a moment and try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Simplified validation - just check if we have image data
    if (!imageData || imageData === 'data:,') {
      showAlertMessage('Failed to capture image. Please try again.');
      return;
    }

    setCapturedImages(prev => ({
      ...prev,
      [angle]: imageData
    }));

    showAlertMessage(`${angle.charAt(0).toUpperCase() + angle.slice(1)} side captured successfully!`);
    stopCamera();
  };

  // Show alert message
  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Handle capture button clicks
  const handleCaptureClick = (angle) => {
    setCurrentCapture(angle);
    startCamera();
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      showAlertMessage('Please select an image file.');
      return;
    }

    // Read file as Data URL (base64)
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setCapturedImages(prev => ({
        ...prev,
        [currentCapture]: imageData
      }));
      showAlertMessage(`${currentCapture.charAt(0).toUpperCase() + currentCapture.slice(1)} side uploaded successfully!`);
      stopCamera();
    };
    reader.onerror = () => {
      showAlertMessage('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Convert API results to detailed analysis format
  const generateDetailedAnalysisData = (apiResults) => {
    // Extract data from the comprehensive API response
    const overallData = apiResults.overall || {};

    // Helper functions for skin tone analysis
    const getSkinToneDescription = (tone) => {
      const descriptions = {
        'Very Fair': 'Very light complexion with pink or red undertones, burns easily in sun',
        'Fair': 'Light complexion that may burn before tanning, often with cool undertones',
        'Medium': 'Balanced complexion that tans gradually, suitable for most makeup shades',
        'Olive': 'Warm, golden undertones with natural sun protection, tans well',
        'Brown': 'Rich, warm complexion with excellent natural sun protection',
        'Dark': 'Deep, rich complexion with strong natural sun protection and warm undertones'
      };
      return descriptions[tone] || 'Balanced complexion suitable for various makeup shades';
    };

    const getSkinUndertone = (tone) => {
      const undertones = {
        'Very Fair': 'Cool (Pink/Red)',
        'Fair': 'Cool (Pink/Blue)',
        'Medium': 'Neutral (Balanced)',
        'Olive': 'Warm (Golden/Yellow)',
        'Brown': 'Warm (Golden/Red)',
        'Dark': 'Warm (Golden/Red)'
      };
      return undertones[tone] || 'Neutral';
    };

    const getSkinToneRecommendations = (tone) => {
      const recommendations = {
        'Very Fair': [
          'Use SPF 30+ daily for sun protection',
          'Choose cool-toned makeup shades',
          'Avoid harsh exfoliation',
          'Consider mineral sunscreens'
        ],
        'Fair': [
          'Use broad-spectrum SPF 30+ daily',
          'Cool or neutral makeup tones work best',
          'Gradual sun exposure with protection',
          'Hydrating products are essential'
        ],
        'Medium': [
          'SPF 25+ recommended for daily use',
          'Wide range of makeup shades suitable',
          'Balanced skincare routine works well',
          'Can handle moderate sun exposure'
        ],
        'Olive': [
          'SPF 20+ for daily protection',
          'Warm-toned makeup enhances natural glow',
          'Natural oils work well for hydration',
          'Good natural sun tolerance'
        ],
        'Brown': [
          'SPF 15+ still important for protection',
          'Rich, warm makeup tones are flattering',
          'Focus on evening skin tone if needed',
          'Excellent natural sun protection'
        ],
        'Dark': [
          'SPF 15+ recommended for UV protection',
          'Deep, rich makeup shades are ideal',
          'Address hyperpigmentation if present',
          'Strong natural melanin protection'
        ]
      };
      return recommendations[tone] || [
        'Use appropriate SPF for your skin tone',
        'Choose makeup that complements your undertones',
        'Maintain consistent skincare routine'
      ];
    };

    // Calculate overall health score based on multiple factors
    const calculateHealthScore = () => {
      let score = 100;
      
      // Deduct points based on skin conditions
      if (overallData.skincondition?.prediction === 'Acne') score -= 20;
      if (overallData.skincondition?.prediction === 'Rosacea') score -= 15;
      if (overallData.skincondition?.prediction === 'Keratosis') score -= 25;
      if (overallData.skincondition?.prediction === 'Melanoma') score -= 40;
      if (overallData.skincondition?.prediction === 'Eczema') score -= 15;
      
      // Deduct points based on Dark.h5 model predictions
      if (overallData.pores?.prediction === 'Severe') score -= 15;
      if (overallData.pores?.prediction === 'Moderate') score -= 10;
      if (overallData.pores?.prediction === 'Mild') score -= 5;
      
      if (overallData.pigmentation?.prediction === 'Severe') score -= 20;
      if (overallData.pigmentation?.prediction === 'Moderate') score -= 12;
      if (overallData.pigmentation?.prediction === 'Mild') score -= 6;
      
      if (overallData.darkcircles?.prediction === 'Severe') score -= 15;
      if (overallData.darkcircles?.prediction === 'Moderate') score -= 10;
      if (overallData.darkcircles?.prediction === 'Mild') score -= 5;
      
      // Adjust based on confidence levels
      const avgConfidence = (
        (overallData.skincondition?.confidence || 0) +
        (overallData.skintone?.confidence || 0) +
        (overallData.skintype?.confidence || 0) +
        (overallData.pores?.confidence || 0) +
        (overallData.pigmentation?.confidence || 0) +
        (overallData.darkcircles?.confidence || 0)
      ) / 6;
      
      score = Math.max(30, Math.min(100, score * avgConfidence));
      
      return Math.round(score);
    };

    return {
      skinType: {
        skinType: overallData.skintype?.prediction || 'Normal',
        confidence: Math.round((overallData.skintype?.confidence || 0) * 100),
        details: {
          oiliness: overallData.skintype?.prediction === 'Oily' ? 80 : 
                   overallData.skintype?.prediction === 'Dry' ? 20 : 50,
          hydration: overallData.skintype?.prediction === 'Dry' ? 30 : 
                    overallData.skintype?.prediction === 'Oily' ? 40 : 70,
          sensitivity: overallData.skincondition?.prediction === 'Eczema' ? 80 : 30
        }
      },
      skinTone: {
        tone: overallData.skintone?.prediction || 'Medium',
        confidence: Math.round((overallData.skintone?.confidence || 0) * 100),
        description: getSkinToneDescription(overallData.skintone?.prediction || 'Medium'),
        undertone: getSkinUndertone(overallData.skintone?.prediction || 'Medium'),
        recommendations: getSkinToneRecommendations(overallData.skintone?.prediction || 'Medium')
      },
      acne: {
        severity: overallData.skincondition?.prediction === 'Acne' ? 'Moderate' : 'None',
        confidence: Math.round((overallData.skincondition?.confidence || 0) * 100),
        locations: overallData.skincondition?.prediction === 'Acne' ? 
                  ['cheeks', 'forehead'] : []
      },
      pores: {
        severity: overallData.pores?.prediction || 'None',
        confidence: Math.round((overallData.pores?.confidence || 0) * 100),
        size: overallData.pores?.prediction === 'Severe' ? 'Large' :
              overallData.pores?.prediction === 'Moderate' ? 'Medium' :
              overallData.pores?.prediction === 'Mild' ? 'Small' : 'Minimal',
        visibility: overallData.pores?.prediction === 'Severe' ? 85 :
                   overallData.pores?.prediction === 'Moderate' ? 60 :
                   overallData.pores?.prediction === 'Mild' ? 35 : 10,
        locations: overallData.pores?.prediction !== 'None' ? 
                  ['T-zone', 'cheeks', 'nose'] : [],
        // Enhanced detailed metrics
        details: {
          distribution: overallData.pores?.prediction === 'Severe' ? 'Widespread' :
                      overallData.pores?.prediction === 'Moderate' ? 'Concentrated' :
                      overallData.pores?.prediction === 'Mild' ? 'Localized' : 'Minimal',
          texture: overallData.pores?.prediction === 'Severe' ? 'Rough' :
                  overallData.pores?.prediction === 'Moderate' ? 'Uneven' :
                  overallData.pores?.prediction === 'Mild' ? 'Slightly textured' : 'Smooth',
          oilProduction: overallData.pores?.prediction === 'Severe' ? 'High' :
                        overallData.pores?.prediction === 'Moderate' ? 'Moderate' :
                        overallData.pores?.prediction === 'Mild' ? 'Normal' : 'Low',
          treatmentUrgency: overallData.pores?.prediction === 'Severe' ? 'High Priority' :
                           overallData.pores?.prediction === 'Moderate' ? 'Moderate Priority' :
                           overallData.pores?.prediction === 'Mild' ? 'Low Priority' : 'Maintenance Only',
          expectedImprovement: overallData.pores?.prediction === 'Severe' ? '6-12 months with treatment' :
                              overallData.pores?.prediction === 'Moderate' ? '3-6 months with care' :
                              overallData.pores?.prediction === 'Mild' ? '1-3 months with routine' : 'Maintain current state'
        }
      },
      pigmentation: {
        severity: overallData.pigmentation?.prediction || 'None',
        type: overallData.pigmentation?.prediction !== 'None' ? 'Hyperpigmentation' : null,
        coverage: overallData.pigmentation?.prediction === 'Severe' ? 25 :
                 overallData.pigmentation?.prediction === 'Moderate' ? 15 :
                 overallData.pigmentation?.prediction === 'Mild' ? 8 : 0,
        confidence: Math.round((overallData.pigmentation?.confidence || 0) * 100),
        // Enhanced detailed metrics
        details: {
          pattern: overallData.pigmentation?.prediction === 'Severe' ? 'Irregular patches' :
                  overallData.pigmentation?.prediction === 'Moderate' ? 'Scattered spots' :
                  overallData.pigmentation?.prediction === 'Mild' ? 'Light discoloration' : 'Even tone',
          depth: overallData.pigmentation?.prediction === 'Severe' ? 'Deep dermal' :
                overallData.pigmentation?.prediction === 'Moderate' ? 'Epidermal-dermal' :
                overallData.pigmentation?.prediction === 'Mild' ? 'Superficial epidermal' : 'No pigmentation',
          likelyType: overallData.pigmentation?.prediction === 'Severe' ? 'Melasma/Post-inflammatory' :
                     overallData.pigmentation?.prediction === 'Moderate' ? 'Solar lentigines/Age spots' :
                     overallData.pigmentation?.prediction === 'Mild' ? 'Mild sun damage' : 'Normal pigmentation',
          treatmentResponse: overallData.pigmentation?.prediction === 'Severe' ? 'Requires professional treatment' :
                            overallData.pigmentation?.prediction === 'Moderate' ? 'Good response to topicals' :
                            overallData.pigmentation?.prediction === 'Mild' ? 'Excellent response to prevention' : 'No treatment needed',
          sunSensitivity: overallData.pigmentation?.prediction !== 'None' ? 'High - requires strict sun protection' : 'Normal',
          expectedImprovement: overallData.pigmentation?.prediction === 'Severe' ? '8-18 months with professional care' :
                              overallData.pigmentation?.prediction === 'Moderate' ? '4-8 months with consistent treatment' :
                              overallData.pigmentation?.prediction === 'Mild' ? '2-4 months with prevention' : 'Maintain current state'
        }
      },
      darkCircles: {
        severity: overallData.darkcircles?.prediction || 'None',
        intensity: overallData.darkcircles?.prediction === 'Severe' ? 75 :
                  overallData.darkcircles?.prediction === 'Moderate' ? 50 :
                  overallData.darkcircles?.prediction === 'Mild' ? 25 : 10,
        confidence: Math.round((overallData.darkcircles?.confidence || 0) * 100),
        // Enhanced detailed metrics
        details: {
          type: overallData.darkcircles?.prediction === 'Severe' ? 'Structural/Genetic' :
               overallData.darkcircles?.prediction === 'Moderate' ? 'Vascular/Pigmented' :
               overallData.darkcircles?.prediction === 'Mild' ? 'Lifestyle-related' : 'No significant circles',
          cause: overallData.darkcircles?.prediction === 'Severe' ? 'Genetic predisposition, thin skin' :
                overallData.darkcircles?.prediction === 'Moderate' ? 'Poor circulation, fatigue, aging' :
                overallData.darkcircles?.prediction === 'Mild' ? 'Sleep deprivation, dehydration' : 'Normal under-eye area',
          texture: overallData.darkcircles?.prediction === 'Severe' ? 'Hollow, sunken appearance' :
                  overallData.darkcircles?.prediction === 'Moderate' ? 'Puffy with discoloration' :
                  overallData.darkcircles?.prediction === 'Mild' ? 'Slight shadowing' : 'Normal contour',
          treatmentApproach: overallData.darkcircles?.prediction === 'Severe' ? 'Professional procedures recommended' :
                            overallData.darkcircles?.prediction === 'Moderate' ? 'Targeted eye care + lifestyle changes' :
                            overallData.darkcircles?.prediction === 'Mild' ? 'Lifestyle optimization + basic eye care' : 'Preventive care only',
          lifestyle: overallData.darkcircles?.prediction !== 'None' ? 'Sleep 7-9 hours, reduce screen time, stay hydrated' : 'Maintain healthy habits',
          expectedImprovement: overallData.darkcircles?.prediction === 'Severe' ? '6-12 months with professional treatment' :
                              overallData.darkcircles?.prediction === 'Moderate' ? '3-6 months with consistent care' :
                              overallData.darkcircles?.prediction === 'Mild' ? '2-8 weeks with lifestyle changes' : 'Maintain current state'
        }
      },
      age: {
        estimatedAge: 25 + Math.floor(Math.random() * 15),
        ageRange: '25-35',
        confidence: 85
      },
      gender: {
        gender: 'Female',
        confidence: 90
      },
      overallHealthScore: calculateHealthScore()
    };
  };

  // Update streak when analysis is completed
  const updateStreakData = useCallback(async () => {
    if (!user?.uid) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // First, try to update streak in database
      const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/streak/update/${user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: today })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Streak updated in database:', result);
        
        // Also update localStorage for immediate UI feedback
        const savedStreakData = localStorage.getItem('skincareStreakData');
        const streakData = savedStreakData ? JSON.parse(savedStreakData) : {};
        
        if (!streakData[today]) {
          streakData[today] = true;
          localStorage.setItem('skincareStreakData', JSON.stringify(streakData));
          
          // Dispatch custom event to notify StreakButton of update
          window.dispatchEvent(new CustomEvent('streakUpdated'));
          
          // Show streak update notification
          showAlertMessage('🔥 Streak updated! Great job on your skincare routine!');
        }
      } else {
        throw new Error('Database update failed');
      }
    } catch (error) {
      console.log('Database streak update failed, using localStorage only:', error.message);
      
      // Fallback to localStorage only
      const savedStreakData = localStorage.getItem('skincareStreakData');
      const streakData = savedStreakData ? JSON.parse(savedStreakData) : {};
      
      if (!streakData[today]) {
        streakData[today] = true;
        localStorage.setItem('skincareStreakData', JSON.stringify(streakData));
        
        // Dispatch custom event to notify StreakButton of update
        window.dispatchEvent(new CustomEvent('streakUpdated'));
        
        // Show streak update notification
        showAlertMessage('🔥 Streak updated! Great job on your skincare routine!');
      }
    }
  }, [user?.uid]);

  // Save report to localStorage and Firestore
  const saveReportToStorage = useCallback(async (analysisData, capturedImage) => {
    if (!user || !analysisData) return;

    try {
      const reportId = Date.now().toString();
      const report = {
        id: reportId,
        date: new Date().toISOString(),
        userId: user.uid,
        ...analysisData,
        capturedImage: capturedImage || capturedImages.front
      };

      // Save to localStorage (for backward compatibility)
      const existingReports = localStorage.getItem(`skinReports_${user.uid}`);
      const reports = existingReports ? JSON.parse(existingReports) : [];
      
      // Add new report
      reports.unshift(report);
      
      // Keep only last 50 reports to avoid storage issues
      if (reports.length > 50) {
        reports.splice(50);
      }
      
      // Save to localStorage
      localStorage.setItem(`skinReports_${user.uid}`, JSON.stringify(reports));
      
      // Try to save to Firestore as well
      try {
        await addDoc(collection(db, 'skinReports'), {
          ...report,
          createdAt: new Date(),
          userEmail: user.email
        });
        console.log('Report saved to Firestore successfully:', reportId);
      } catch (firestoreError) {
        console.log('Firestore save failed, but localStorage save succeeded:', firestoreError.message);
      }
      
      // Auto-sync user statistics after saving report
      try {
        const apiUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
        const syncResponse = await fetch(`${apiUrl}/user/${user.uid}/stats/sync`);
        if (syncResponse.ok) {
          console.log('✅ User stats auto-synced after analysis');
        }
      } catch (syncError) {
        console.log('Stats sync failed after analysis:', syncError.message);
      }
      
      console.log('Report saved successfully:', reportId);
    } catch (error) {
      console.error('Error saving report:', error);
    }
  }, [user, capturedImages.front]);

  const base64ToFile = (base64String, filename, mimeType) => {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  };

  // Detect skin conditions using trained CNN model
  const detectSkinConditions = async () => {
    if (!capturedImages.left || !capturedImages.right || !capturedImages.front) {
      showAlertMessage('Please capture all three angles before analysis.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Prepare images for API
      const imageFiles = {
        left: base64ToFile(capturedImages.left, 'left.jpg', 'image/jpeg'),
        right: base64ToFile(capturedImages.right, 'right.jpg', 'image/jpeg'),
        front: base64ToFile(capturedImages.front, 'front.jpg', 'image/jpeg')
      };

      // Create FormData to send images
      const formData = new FormData();
      formData.append('left_image', imageFiles.left);
      formData.append('right_image', imageFiles.right);
      formData.append('front_image', imageFiles.front);

      // API endpoint - update this with your model endpoint
      const baseUrl = process.env.REACT_APP_MODEL_API_URL || 'http://localhost:8001';
      let apiUrl = `${baseUrl}/predict`;
      
      // Add user_id as query parameter if available
      if (user?.uid) {
        apiUrl += `?user_id=${encodeURIComponent(user.uid)}`;
      }
      
      // Send request to your CNN model API
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const results = await response.json();
      console.log('API Response:', results); // Debug log
      
      // Process results - new comprehensive format with landmarks
      // Expected format: { left: { skincondition: {...}, skintone: {...}, skintype: {...}, pores: {...}, pigmentation: {...}, darkcircles: {...}, landmarks: {...}, face_quality: {...} }, right: {...}, front: {...}, overall: {...} }
      const processedResults = {
        left: {
          condition: results.left?.skincondition?.prediction || 'Unknown',
          percentage: Math.round((results.left?.skincondition?.confidence || 0) * 100),
          tone: results.left?.skintone?.prediction || 'Unknown',
          toneConfidence: Math.round((results.left?.skintone?.confidence || 0) * 100),
          type: results.left?.skintype?.prediction || 'Unknown',
          typeConfidence: Math.round((results.left?.skintype?.confidence || 0) * 100),
          pores: results.left?.pores?.prediction || 'Unknown',
          poresConfidence: Math.round((results.left?.pores?.confidence || 0) * 100),
          pigmentation: results.left?.pigmentation?.prediction || 'Unknown',
          pigmentationConfidence: Math.round((results.left?.pigmentation?.confidence || 0) * 100),
          darkcircles: results.left?.darkcircles?.prediction || 'Unknown',
          darkcirclesConfidence: Math.round((results.left?.darkcircles?.confidence || 0) * 100),
          landmarks: results.left?.landmarks || null,
          faceQuality: results.left?.face_quality || null
        },
        right: {
          condition: results.right?.skincondition?.prediction || 'Unknown',
          percentage: Math.round((results.right?.skincondition?.confidence || 0) * 100),
          tone: results.right?.skintone?.prediction || 'Unknown',
          toneConfidence: Math.round((results.right?.skintone?.confidence || 0) * 100),
          type: results.right?.skintype?.prediction || 'Unknown',
          typeConfidence: Math.round((results.right?.skintype?.confidence || 0) * 100),
          pores: results.right?.pores?.prediction || 'Unknown',
          poresConfidence: Math.round((results.right?.pores?.confidence || 0) * 100),
          pigmentation: results.right?.pigmentation?.prediction || 'Unknown',
          pigmentationConfidence: Math.round((results.right?.pigmentation?.confidence || 0) * 100),
          darkcircles: results.right?.darkcircles?.prediction || 'Unknown',
          darkcirclesConfidence: Math.round((results.right?.darkcircles?.confidence || 0) * 100),
          landmarks: results.right?.landmarks || null,
          faceQuality: results.right?.face_quality || null
        },
        front: {
          condition: results.front?.skincondition?.prediction || 'Unknown',
          percentage: Math.round((results.front?.skincondition?.confidence || 0) * 100),
          tone: results.front?.skintone?.prediction || 'Unknown',
          toneConfidence: Math.round((results.front?.skintone?.confidence || 0) * 100),
          type: results.front?.skintype?.prediction || 'Unknown',
          typeConfidence: Math.round((results.front?.skintype?.confidence || 0) * 100),
          pores: results.front?.pores?.prediction || 'Unknown',
          poresConfidence: Math.round((results.front?.pores?.confidence || 0) * 100),
          pigmentation: results.front?.pigmentation?.prediction || 'Unknown',
          pigmentationConfidence: Math.round((results.front?.pigmentation?.confidence || 0) * 100),
          darkcircles: results.front?.darkcircles?.prediction || 'Unknown',
          darkcirclesConfidence: Math.round((results.front?.darkcircles?.confidence || 0) * 100),
          landmarks: results.front?.landmarks || null,
          faceQuality: results.front?.face_quality || null
        },
        overall: {
          condition: results.overall?.skincondition?.prediction || 'Unknown',
          percentage: Math.round((results.overall?.skincondition?.confidence || 0) * 100),
          tone: results.overall?.skintone?.prediction || 'Unknown',
          toneConfidence: Math.round((results.overall?.skintone?.confidence || 0) * 100),
          type: results.overall?.skintype?.prediction || 'Unknown',
          typeConfidence: Math.round((results.overall?.skintype?.confidence || 0) * 100),
          pores: results.overall?.pores?.prediction || 'Unknown',
          poresConfidence: Math.round((results.overall?.pores?.confidence || 0) * 100),
          pigmentation: results.overall?.pigmentation?.prediction || 'Unknown',
          pigmentationConfidence: Math.round((results.overall?.pigmentation?.confidence || 0) * 100),
          darkcircles: results.overall?.darkcircles?.prediction || 'Unknown',
          darkcirclesConfidence: Math.round((results.overall?.darkcircles?.confidence || 0) * 100)
        }
      };
      
      setSkinAnalysisResults(processedResults);
      
      setSkinAnalysisResults(processedResults);
      
      // Process results but don't show the old analysis view
      // Automatically generate detailed report data
      const detailedData = generateDetailedAnalysisData(results);
      setDetailedAnalysisData(detailedData);
      setShowDetailedReport(true);
      
      // Save the report to localStorage
      saveReportToStorage(detailedData, capturedImages.front);
      
      // Update streak when analysis is completed
      updateStreakData();
      
    } catch (error) {
      console.error('Error detecting skin conditions:', error);
      showAlertMessage(`Error analyzing images: ${error.message}. Please try again.`);
      
      // Don't use mock results - show the actual error
      setSkinAnalysisResults(null);
      setDetailedAnalysisData(null);
      setShowDetailedReport(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset captures
  const resetCaptures = () => {
    setCapturedImages({ left: null, right: null, front: null });
    setSkinAnalysisResults(null);
    setDetailedAnalysisData(null);
    setShowDetailedReport(false);
    stopCamera();
  };

  // Handle back to home
  const handleBackToHome = () => {
    stopCamera();
    navigate('/home');
  };

  return (
    <div className={styles.wrapper}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Skin Condition Detection</h1>
        <p>Capture your face from multiple angles for comprehensive analysis</p>
        <button className={styles.backBtn} onClick={handleBackToHome}>
          ← Back to Home
        </button>
      </div>

      {/* Skin Condition Detection */}
      <div className={styles.skinDetectionContainer}>
        {/* Instructions */}
        <div className={styles.skinDetectionHeader}>
          <p className={styles.subtitle}>Please take three selfies: Left side, Right side and Front view of your face.</p>
          
          {/* Example Photos Section */}
          <div className={styles.examplePhotosSection}>
            <h3 className={styles.exampleTitle}>📸 How to Take Perfect Selfies</h3>
            <div className={styles.examplePhotosGrid}>
              
              {/* Left Side Example */}
              <div className={styles.examplePhotoCard}>
                <div className={styles.examplePhotoContainer}>
                  <img src={leftExamplePhoto} alt="Left side example" className={styles.examplePhoto} />
                  <div className={styles.exampleOverlay}>
                    <span className={styles.exampleLabel}>LEFT SIDE</span>
                  </div>
                </div>
                <div className={styles.exampleDescription}>
                  <h4>Left Profile</h4>
                  <ul>
                    <li>Turn your head 90° to the left</li>
                    <li>Keep your face straight and relaxed</li>
                    <li>Ensure good lighting on your profile</li>
                    <li>Show your complete side profile</li>
                  </ul>
                </div>
              </div>

              {/* Front View Example */}
              <div className={styles.examplePhotoCard}>
                <div className={styles.examplePhotoContainer}>
                  <img src={frontExamplePhoto} alt="Front view example" className={styles.examplePhoto} />
                  <div className={styles.exampleOverlay}>
                    <span className={styles.exampleLabel}>FRONT VIEW</span>
                  </div>
                </div>
                <div className={styles.exampleDescription}>
                  <h4>Front Face</h4>
                  <ul>
                    <li>Look directly at the camera</li>
                    <li>Keep your face centered in frame</li>
                    <li>Maintain neutral expression</li>
                    <li>Ensure even lighting on both sides</li>
                  </ul>
                </div>
              </div>

              {/* Right Side Example */}
              <div className={styles.examplePhotoCard}>
                <div className={styles.examplePhotoContainer}>
                  <img src={rightExamplePhoto} alt="Right side example" className={styles.examplePhoto} />
                  <div className={styles.exampleOverlay}>
                    <span className={styles.exampleLabel}>RIGHT SIDE</span>
                  </div>
                </div>
                <div className={styles.exampleDescription}>
                  <h4>Right Profile</h4>
                  <ul>
                    <li>Turn your head 90° to the right</li>
                    <li>Mirror the left side positioning</li>
                    <li>Maintain consistent lighting</li>
                    <li>Show your complete side profile</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* General Tips */}
            <div className={styles.generalTips}>
              <h4>💡 General Tips for Best Results</h4>
              <div className={styles.tipsGrid}>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>💡</span>
                  <span>Use natural lighting or bright indoor light</span>
                </div>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>📱</span>
                  <span>Hold camera at eye level for best angle</span>
                </div>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>🧼</span>
                  <span>Clean your face before taking photos</span>
                </div>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>😐</span>
                  <span>Keep a neutral expression in all photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Capture Section */}
        <div className={styles.captureSection}>
          <div className={styles.captureButtons}>
            <button 
              className={`${styles.captureBtn} ${styles.leftBtn} ${capturedImages.left ? styles.captured : ''}`}
              onClick={() => handleCaptureClick('left')}
            >
              <span className={styles.icon}>📸</span>
              <span className={styles.text}>Capture Left Side</span>
              {capturedImages.left && <span className={styles.checkmark}>✓</span>}
            </button>
            
            <button 
              className={`${styles.captureBtn} ${styles.rightBtn} ${capturedImages.right ? styles.captured : ''}`}
              onClick={() => handleCaptureClick('right')}
            >
              <span className={styles.icon}>📸</span>
              <span className={styles.text}>Capture Right Side</span>
              {capturedImages.right && <span className={styles.checkmark}>✓</span>}
            </button>
            
            <button 
              className={`${styles.captureBtn} ${styles.frontBtn} ${capturedImages.front ? styles.captured : ''}`}
              onClick={() => handleCaptureClick('front')}
            >
              <span className={styles.icon}>📸</span>
              <span className={styles.text}>Capture Front View</span>
              {capturedImages.front && <span className={styles.checkmark}>✓</span>}
            </button>
          </div>

          {/* Camera Feed */}
          {currentCapture && (
            <div className={styles.cameraFeedContainer}>
              <div className={styles.cameraOverlay}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.cameraFeed}
                />
                <canvas
                  ref={canvasRef}
                  className={styles.captureCanvas}
                  style={{ display: 'none' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <div className={styles.captureControls}>
                  <button 
                    className={styles.captureNowBtn}
                    onClick={() => captureImage(currentCapture)}
                  >
                    📸 Capture Now
                  </button>
                  <button 
                    className={styles.captureNowBtn}
                    onClick={handleUploadClick}
                    style={{background: '#27ae60', marginLeft: '10px'}}
                  >
                    📁 Upload Image
                  </button>
                  <button 
                    className={styles.cancelBtn}
                    onClick={stopCamera}
                  >
                    Cancel
                  </button>
                </div>
                <div style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', borderRadius: '5px', fontSize: '12px'}}>
                  Camera: {videoRef.current?.videoWidth || 0} x {videoRef.current?.videoHeight || 0}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className={styles.actionSection}>
          <button 
            className={`${styles.detectBtn} ${Object.values(capturedImages).every(img => img) ? styles.ready : styles.disabled}`}
            onClick={detectSkinConditions}
            disabled={!Object.values(capturedImages).every(img => img) || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Detect Skin Conditions'}
          </button>
          
          <button 
            className={styles.resetBtn}
            onClick={resetCaptures}
          >
            Reset All
          </button>
        </div>

        {/* Results Section - Show only detailed report */}
        {showDetailedReport && detailedAnalysisData && (
          <div className={styles.resultsSection}>
            <div className={styles.detailedReportContainer}>
              <VisageAISkinReport
                analysisData={detailedAnalysisData}
                capturedImage={capturedImages.front}
                onClose={() => {
                  setShowDetailedReport(false);
                  setDetailedAnalysisData(null);
                  setSkinAnalysisResults(null);
                }}
              />
            </div>
            
            {/* Product Recommendation System */}
            <div className={styles.productRecommendationContainer}>
              <ProductRecommendationSystem analysisData={detailedAnalysisData} />
            </div>
          </div>
        )}
      </div>

      {/* Alert Popup */}
      {showAlert && (
        <div className={styles.alertPopup}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>⚠</span>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {/* Removed - now showing inline */}
    </div>
  );
};

export default FacialAnalysis;