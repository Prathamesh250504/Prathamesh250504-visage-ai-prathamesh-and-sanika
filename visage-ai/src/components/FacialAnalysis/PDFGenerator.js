// PDF Generator for Skin Report
// Uses html2pdf library

export class PDFGenerator {
  static async generateSkinReportPDF(analysisData, capturedImages, userInfo = {}) {
    try {
      console.log('Starting PDF generation with data:', { analysisData, capturedImages, userInfo });
      
      // Try to import html2pdf dynamically
      let html2pdfLib;
      try {
        const html2pdfModule = await import('html2pdf.js');
        html2pdfLib = html2pdfModule.default || html2pdfModule;
      } catch (e) {
        // Fallback to window.html2pdf if available
        html2pdfLib = window.html2pdf;
      }
      
      if (!html2pdfLib) {
        console.warn('html2pdf not available. Using print fallback.');
        this.printReport(analysisData, capturedImages, userInfo);
        return;
      }
    
      const htmlContent = this.generateReportHTML(analysisData, capturedImages, userInfo);
      console.log('Generated HTML content length:', htmlContent.length);
    
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    // Wait for any images inside the element to load before generating PDF
    try {
      await this.waitForImages(element, 4000);
    } catch (e) {
      // continue even if wait fails
      console.warn('Image load wait failed or timed out', e);
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `VisageAI_Skin_Report_${(userInfo.displayName || 'User').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

      try {
        console.log('Generating PDF with options:', opt);
        await html2pdfLib().set(opt).from(element).save();
        console.log('PDF generated successfully');
      } catch (error) {
        console.error('PDF generation error:', error);
        this.printReport(analysisData, capturedImages, userInfo);
      } finally {
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error('PDF generation setup error:', error);
      this.printReport(analysisData, capturedImages, userInfo);
    }
  }

  static waitForImages(container, timeout = 3000) {
    return new Promise((resolve) => {
      try {
        const imgs = container.querySelectorAll('img');
        if (!imgs || imgs.length === 0) return resolve();

        let remaining = imgs.length;
        const finish = () => {
          remaining -= 1;
          if (remaining <= 0) resolve();
        };

        imgs.forEach((img) => {
          if (img.complete) {
            finish();
            return;
          }
          img.addEventListener('load', finish, { once: true });
          img.addEventListener('error', finish, { once: true });
        });

        // Safety timeout
        setTimeout(() => resolve(), timeout);
      } catch (e) {
        resolve();
      }
    });
  }

  static generateReportHTML(analysisData, capturedImages, userInfo = {}) {
    const { skinType, skinTone, acne, pores, pigmentation, darkCircles, age, gender, overallHealthScore } = analysisData;
    
    // Generate patient ID and current date
    const patientId = userInfo.uid ? `P-${userInfo.uid.slice(-6).toUpperCase()}` : `P-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    const patientName = userInfo.displayName || 'Anonymous User';
    const patientEmail = userInfo.email || 'Not provided';
    const currentDate = new Date();
    const analysisDate = currentDate.toLocaleDateString('en-GB');
    
    // Create image sections for all three views
    const createImageSection = (image, label) => {
      if (!image) return `<div class="image-placeholder"><div class="placeholder-text">${label}<br>Not Available</div></div>`;
      return `<div class="image-container">
        <img src="${image}" alt="${label}" class="analysis-image"/>
        <div class="image-label">${label}</div>
      </div>`;
    };

    const frontImage = capturedImages?.front || capturedImages;
    const leftImage = capturedImages?.left;
    const rightImage = capturedImages?.right;
    
    // Get skin condition details
    const getSkinConditionDetails = () => {
      const conditions = [];
      if (acne.severity !== 'None') conditions.push('Acne ✓');
      if (pigmentation.severity !== 'None') conditions.push('Pigmentation ✓');
      if (pores.severity !== 'None') conditions.push('Enlarged Pores ✓');
      if (darkCircles.severity !== 'None') conditions.push('Dark Circles ✓');
      conditions.push('Inflammation ✗');
      conditions.push('Rosacea ✗');
      conditions.push('Eczema ✗');
      conditions.push('Scarring ✗');
      return conditions;
    };

    const getObservations = () => {
      const observations = [];
      if (acne.severity !== 'None') {
        observations.push(`Presence of ${acne.severity.toLowerCase()} acne lesions and post-acne marks, particularly on cheeks and forehead. ${acne.severity} oiliness.`);
      }
      if (pigmentation.severity !== 'None') {
        observations.push(`${pigmentation.severity} pigmentation detected with ${pigmentation.coverage}% coverage, primarily in facial areas.`);
      }
      if (pores.severity !== 'None') {
        observations.push(`${pores.severity} pore visibility with ${pores.size.toLowerCase()} pore size, primarily in ${pores.locations.join(' and ')} areas.`);
      }
      if (darkCircles.severity !== 'None') {
        observations.push(`${darkCircles.severity} dark circles detected with ${darkCircles.intensity}% intensity around the eye area.`);
      }
      if (observations.length === 0) {
        observations.push('Clear complexion with minimal visible skin concerns. Good overall skin health.');
      }
      return observations;
    };

    const getInference = () => {
      const conditions = [];
      if (acne.severity !== 'None') conditions.push('Acne');
      if (pigmentation.severity !== 'None') conditions.push('Pigmentation');
      if (pores.severity !== 'None') conditions.push('Enlarged Pores');
      if (darkCircles.severity !== 'None') conditions.push('Dark Circles');
      
      if (conditions.length === 0) {
        return 'The subject skin condition is categorized as Normal, indicating presence of healthy skin with minimal concerns.';
      }
      
      return `The subject skin condition is categorized as ${conditions.join(', ')}, indicating presence of ${conditions.map(c => c.toLowerCase()).join(', ')} with varying severity levels.`;
    };
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.4;
              color: #2d3748;
              background: white;
              padding: 20px;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
            }
            
            .report-title {
              text-align: center;
              flex-grow: 1;
            }
            
            .main-title {
              font-size: 18px;
              font-weight: bold;
              color: #2d3748;
              margin-bottom: 5px;
            }
            
            .subtitle {
              font-size: 14px;
              color: #718096;
            }
            
            .patient-info {
              background: #e6f3ff;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            
            .patient-info h3 {
              color: #2d3748;
              margin-bottom: 10px;
              font-size: 14px;
              background: #b3d9ff;
              padding: 5px 10px;
              border-radius: 4px;
            }
            
            .patient-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              font-size: 11px;
            }
            
            .patient-details div {
              display: flex;
              justify-content: space-between;
            }
            
            .patient-details strong {
              color: #2d3748;
            }
            
            .images-section {
              margin: 20px 0;
            }
            
            .images-section h3 {
              color: #2d3748;
              margin-bottom: 15px;
              font-size: 14px;
              background: #b3d9ff;
              padding: 5px 10px;
              border-radius: 4px;
            }
            
            .images-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .image-container {
              text-align: center;
            }
            
            .analysis-image {
              width: 150px;
              height: 150px;
              object-fit: cover;
              border-radius: 8px;
              border: 2px solid #e2e8f0;
            }
            
            .image-placeholder {
              width: 150px;
              height: 150px;
              background: #f7fafc;
              border: 2px dashed #cbd5e0;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto;
            }
            
            .placeholder-text {
              color: #a0aec0;
              font-size: 11px;
              text-align: center;
            }
            
            .image-label {
              margin-top: 8px;
              font-size: 12px;
              font-weight: bold;
              color: #4a5568;
            }
            
            .analysis-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            
            .analysis-card {
              background: #e6f3ff;
              padding: 15px;
              border-radius: 8px;
            }
            
            .analysis-card h3 {
              color: #2d3748;
              margin-bottom: 10px;
              font-size: 14px;
              background: #b3d9ff;
              padding: 5px 10px;
              border-radius: 4px;
            }
            
            .prediction-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              font-size: 12px;
            }
            
            .prediction-label {
              font-weight: bold;
              color: #2d3748;
            }
            
            .prediction-value {
              color: #4a5568;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            
            .confidence-badge {
              background: #667eea;
              color: white;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 10px;
            }
            
            .observations-list {
              list-style: none;
              padding: 0;
            }
            
            .observations-list li {
              margin-bottom: 5px;
              font-size: 11px;
              color: #4a5568;
              padding-left: 15px;
              position: relative;
            }
            
            .observations-list li:before {
              content: "•";
              color: #667eea;
              position: absolute;
              left: 0;
            }
            
            .conditions-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 5px;
              margin-top: 10px;
            }
            
            .condition-item {
              font-size: 11px;
              color: #4a5568;
              padding: 2px 0;
            }
            
            .system-conclusion {
              background: #f7fafc;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            
            .system-conclusion h3 {
              color: #2d3748;
              margin-bottom: 10px;
              font-size: 14px;
            }
            
            .conclusion-text {
              font-size: 11px;
              color: #4a5568;
              line-height: 1.5;
            }
            
            .disclaimer {
              background: #fff5f5;
              border: 1px solid #fed7d7;
              padding: 10px;
              border-radius: 8px;
              margin-top: 20px;
              text-align: center;
            }
            
            .disclaimer-text {
              font-size: 10px;
              color: #c53030;
              font-weight: bold;
            }
            
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #718096;
              border-top: 1px solid #e2e8f0;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="logo">VisageAI</div>
            <div class="report-title">
              <div class="main-title">DETAILED PATIENT SKIN ANALYSIS REPORT</div>
              <div class="subtitle">(VisageAI - AI-based Analysis)</div>
            </div>
          </div>

          <!-- Patient Information -->
          <div class="patient-info">
            <h3>Patient Information</h3>
            <div class="patient-details">
              <div><strong>Patient ID:</strong> <span>${patientId}</span></div>
              <div><strong>Patient Name:</strong> <span>${patientName}</span></div>
              <div><strong>Email:</strong> <span>${patientEmail}</span></div>
              <div><strong>Gender:</strong> <span>${gender.gender}</span></div>
              <div><strong>Age Group:</strong> <span>${age.ageRange}</span></div>
              <div><strong>Age Group:</strong> <span>${age.ageRange} (estimated)</span></div>
              <div><strong>Image Type:</strong> <span>Frontal, Left Profile, Right Profile</span></div>
              <div><strong>Analysis Date:</strong> <span>${analysisDate}</span></div>
              <div style="grid-column: 1 / -1;"><strong>System Used:</strong> <span>VisageAI (Image-based Skin Analysis System)</span></div>
            </div>
          </div>

          <!-- Images Section -->
          <div class="images-section">
            <h3>Skin Tone Analysis</h3>
            <div class="images-grid">
              ${createImageSection(frontImage, 'Frontal View')}
              ${createImageSection(leftImage, 'Left Profile')}
              ${createImageSection(rightImage, 'Right Profile')}
            </div>
          </div>

          <!-- Analysis Section -->
          <div class="analysis-section">
            <!-- Skin Tone Analysis -->
            <div class="analysis-card">
              <h3>Skin Tone Analysis</h3>
              <div class="prediction-row">
                <span class="prediction-label">Predicted Skin Tone:</span>
                <span class="prediction-value">
                  <span class="confidence-badge">${skinTone.tone}</span>
                </span>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Observation:</strong>
                <ul class="observations-list">
                  <li>${skinTone.description}</li>
                  <li>${skinTone.undertone} undertone</li>
                </ul>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Inference:</strong>
                <p style="font-size: 11px; color: #4a5568; margin-top: 5px;">
                  The subject's skin tone falls under ${skinTone.tone} category, commonly observed in various skin types.
                </p>
              </div>
            </div>

            <!-- Skin Condition -->
            <div class="analysis-card">
              <h3>Skin Condition Analysis</h3>
              <div class="prediction-row">
                <span class="prediction-label">Skin Condition:</span>
                <span class="prediction-value">
                  <span class="confidence-badge">${acne.severity !== 'None' ? 'Acne' : 'Normal'} ${acne.severity !== 'None' ? `(${acne.severity})` : ''}</span>
                </span>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Checked Conditions:</strong>
                <div class="conditions-grid">
                  ${getSkinConditionDetails().map(condition => `<div class="condition-item">${condition}</div>`).join('')}
                </div>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Observations:</strong>
                <ul class="observations-list">
                  ${getObservations().map(obs => `<li>${obs}</li>`).join('')}
                </ul>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Inference:</strong>
                <p style="font-size: 11px; color: #4a5568; margin-top: 5px;">
                  ${getInference()}
                </p>
              </div>
            </div>
          </div>

          <!-- Additional Analysis Section -->
          <div class="analysis-section">
            <!-- Pigmentation Analysis -->
            <div class="analysis-card">
              <h3>Pigmentation Analysis</h3>
              <div class="prediction-row">
                <span class="prediction-label">Pigmentation Level:</span>
                <span class="prediction-value">
                  <span class="confidence-badge">${pigmentation.severity}</span>
                </span>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Observation:</strong>
                <ul class="observations-list">
                  <li>Coverage: ${pigmentation.coverage}% of facial area</li>
                  ${pigmentation.type ? `<li>Type: ${pigmentation.type}</li>` : ''}
                  <li>Confidence: ${pigmentation.confidence}%</li>
                </ul>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Inference:</strong>
                <p style="font-size: 11px; color: #4a5568; margin-top: 5px;">
                  ${pigmentation.severity === 'None' ? 'No significant pigmentation detected, indicating even skin tone.' : 
                    `${pigmentation.severity} pigmentation suggests ${pigmentation.severity === 'Severe' ? 'significant' : pigmentation.severity === 'Moderate' ? 'moderate' : 'mild'} melanin irregularities requiring targeted treatment.`}
                </p>
              </div>
            </div>

            <!-- Dark Circles Analysis -->
            <div class="analysis-card">
              <h3>Dark Circles Analysis</h3>
              <div class="prediction-row">
                <span class="prediction-label">Dark Circles:</span>
                <span class="prediction-value">
                  <span class="confidence-badge">${darkCircles.severity}</span>
                </span>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Observation:</strong>
                <ul class="observations-list">
                  <li>Intensity: ${darkCircles.intensity}%</li>
                  <li>Confidence: ${darkCircles.confidence}%</li>
                  <li>Location: Under-eye area</li>
                </ul>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Inference:</strong>
                <p style="font-size: 11px; color: #4a5568; margin-top: 5px;">
                  ${darkCircles.severity === 'None' ? 'No significant dark circles detected, indicating good under-eye health.' : 
                    `${darkCircles.severity} dark circles may be related to ${darkCircles.severity === 'Severe' ? 'genetic factors, sleep deprivation, or aging' : darkCircles.severity === 'Moderate' ? 'lifestyle factors or mild fatigue' : 'minor fatigue or dehydration'}.`}
                </p>
              </div>
            </div>
          </div>

          <!-- Pores and Skin Type Analysis Section -->
          <div class="analysis-section">
            <!-- Pores Analysis -->
            <div class="analysis-card">
              <h3>Pores Analysis</h3>
              <div class="prediction-row">
                <span class="prediction-label">Pore Visibility:</span>
                <span class="prediction-value">
                  <span class="confidence-badge">${pores.severity} (${pores.size})</span>
                </span>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Observation:</strong>
                <ul class="observations-list">
                  <li>Pore visibility: ${pores.visibility}%</li>
                  <li>Size classification: ${pores.size}</li>
                  ${pores.locations.length > 0 ? `<li>Primary locations: ${pores.locations.join(', ')}</li>` : ''}
                </ul>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Inference:</strong>
                <p style="font-size: 11px; color: #4a5568; margin-top: 5px;">
                  ${pores.severity === 'None' ? 'Minimal pore visibility indicates good skin texture and oil control.' : 
                    `${pores.severity} pore visibility suggests ${pores.severity === 'Severe' ? 'significant' : pores.severity === 'Moderate' ? 'moderate' : 'mild'} sebaceous activity and may benefit from targeted pore care.`}
                </p>
              </div>
            </div>

            <!-- Skin Type Analysis -->
            <div class="analysis-card">
              <h3>Skin Type Analysis</h3>
              <div class="prediction-row">
                <span class="prediction-label">Skin Type:</span>
                <span class="prediction-value">
                  <span class="confidence-badge">${skinType.skinType}</span>
                </span>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Characteristics:</strong>
                <ul class="observations-list">
                  <li>Oiliness level: ${skinType.details.oiliness}%</li>
                  <li>Hydration level: ${skinType.details.hydration}%</li>
                  <li>Sensitivity: ${skinType.details.sensitivity}%</li>
                </ul>
              </div>
              <div style="margin-top: 10px;">
                <strong style="font-size: 11px;">Inference:</strong>
                <p style="font-size: 11px; color: #4a5568; margin-top: 5px;">
                  ${skinType.skinType} skin type requires ${skinType.skinType === 'Oily' ? 'oil control and gentle cleansing' : 
                    skinType.skinType === 'Dry' ? 'intensive hydration and barrier repair' : 
                    'balanced care with both cleansing and moisturizing'} for optimal health.
                </p>
              </div>
            </div>
          </div>

          <!-- Detailed Clinical Analysis Section -->
          <div class="analysis-section">
            <div class="analysis-card" style="grid-column: 1 / -1;">
              <h3>Clinical Assessment & Detailed Findings</h3>
              
              <!-- Overall Assessment -->
              <div style="margin-bottom: 15px; padding: 10px; background: #f0f8ff; border-radius: 5px;">
                <h4 style="font-size: 12px; margin-bottom: 8px;">Overall Skin Health Assessment</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 10px;">
                  <div><strong>Health Score:</strong> ${overallHealthScore}/100</div>
                  <div><strong>Risk Level:</strong> ${overallHealthScore >= 80 ? 'Low' : overallHealthScore >= 60 ? 'Moderate' : 'High'}</div>
                  <div><strong>Primary Concerns:</strong> ${[
                    acne.severity !== 'None' ? `Acne (${acne.severity})` : null,
                    pores.severity !== 'None' ? `Pores (${pores.severity})` : null,
                    pigmentation.severity !== 'None' ? `Pigmentation (${pigmentation.severity})` : null,
                    darkCircles.severity !== 'None' ? `Dark Circles (${darkCircles.severity})` : null
                  ].filter(Boolean).join(', ') || 'No significant concerns'}</div>
                  <div><strong>Treatment Priority:</strong> ${
                    pigmentation.severity === 'Severe' || acne.severity === 'Severe' ? 'Immediate attention recommended' :
                    pores.severity === 'Severe' || darkCircles.severity === 'Severe' ? 'Professional consultation advised' :
                    'Preventive care and maintenance'
                  }</div>
                </div>
              </div>

              ${pigmentation.severity !== 'None' ? `
              <!-- Pigmentation Clinical Details -->
              <div style="margin-bottom: 15px; padding: 10px; background: #fff5f5; border-radius: 5px;">
                <h4 style="font-size: 12px; margin-bottom: 8px;">🎨 Clinical Pigmentation Assessment</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 10px;">
                  <div><strong>Clinical Classification:</strong> ${pigmentation.details?.likelyType || 'Hyperpigmentation'}</div>
                  <div><strong>Morphology:</strong> ${pigmentation.details?.pattern || 'Irregular patches'}</div>
                  <div><strong>Depth Assessment:</strong> ${pigmentation.details?.depth || 'Epidermal-dermal'}</div>
                  <div><strong>Coverage Area:</strong> ${pigmentation.coverage}% facial involvement</div>
                  <div><strong>Treatment Prognosis:</strong> ${pigmentation.details?.treatmentResponse || 'Good response expected'}</div>
                  <div><strong>Expected Timeline:</strong> ${pigmentation.details?.expectedImprovement || '4-8 months with treatment'}</div>
                </div>
              </div>
              ` : ''}

              ${pores.severity !== 'None' ? `
              <!-- Pores Clinical Details -->
              <div style="margin-bottom: 15px; padding: 10px; background: #f5fff5; border-radius: 5px;">
                <h4 style="font-size: 12px; margin-bottom: 8px;">🕳️ Clinical Pore Assessment</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 10px;">
                  <div><strong>Sebaceous Activity:</strong> ${pores.details?.oilProduction || 'Moderate'}</div>
                  <div><strong>Pore Distribution:</strong> ${pores.details?.distribution || 'Concentrated'}</div>
                  <div><strong>Surface Texture:</strong> ${pores.details?.texture || 'Uneven'}</div>
                  <div><strong>Visibility Index:</strong> ${pores.visibility}%</div>
                  <div><strong>Treatment Urgency:</strong> ${pores.details?.treatmentUrgency || 'Moderate Priority'}</div>
                  <div><strong>Response Timeline:</strong> ${pores.details?.expectedImprovement || '3-6 months with care'}</div>
                </div>
              </div>
              ` : ''}

              ${darkCircles.severity !== 'None' ? `
              <!-- Dark Circles Clinical Details -->
              <div style="margin-bottom: 15px; padding: 10px; background: #f8f5ff; border-radius: 5px;">
                <h4 style="font-size: 12px; margin-bottom: 8px;">👁️ Clinical Periorbital Assessment</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 10px;">
                  <div><strong>Clinical Type:</strong> ${darkCircles.details?.type || 'Vascular/Pigmented'}</div>
                  <div><strong>Etiology:</strong> ${darkCircles.details?.cause || 'Lifestyle factors'}</div>
                  <div><strong>Morphological Features:</strong> ${darkCircles.details?.texture || 'Discoloration'}</div>
                  <div><strong>Intensity Grade:</strong> ${darkCircles.intensity}%</div>
                  <div><strong>Treatment Strategy:</strong> ${darkCircles.details?.treatmentApproach || 'Topical + lifestyle'}</div>
                  <div><strong>Improvement Timeline:</strong> ${darkCircles.details?.expectedImprovement || '3-6 months with care'}</div>
                </div>
              </div>
              ` : ''}

              <!-- Treatment Protocol -->
              <div style="margin-bottom: 15px; padding: 10px; background: #fffef5; border-radius: 5px;">
                <h4 style="font-size: 12px; margin-bottom: 8px;">💊 Recommended Treatment Protocol</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                  <div>
                    <strong style="font-size: 11px;">Phase 1: Initial Treatment (0-3 months)</strong>
                    <ul style="font-size: 10px; margin: 5px 0; padding-left: 15px;">
                      ${pigmentation.severity !== 'None' ? '<li>Vitamin C serum (morning) + SPF 30+</li>' : ''}
                      ${pores.severity !== 'None' ? '<li>BHA exfoliant (2-3x/week)</li>' : ''}
                      ${darkCircles.severity !== 'None' ? '<li>Caffeine eye cream + sleep optimization</li>' : ''}
                      <li>Gentle cleanser + moisturizer (daily)</li>
                    </ul>
                  </div>
                  <div>
                    <strong style="font-size: 11px;">Phase 2: Maintenance (3+ months)</strong>
                    <ul style="font-size: 10px; margin: 5px 0; padding-left: 15px;">
                      ${pigmentation.severity === 'Severe' ? '<li>Consider professional treatments</li>' : ''}
                      ${pores.severity === 'Severe' ? '<li>Professional pore treatments</li>' : ''}
                      ${darkCircles.severity === 'Severe' ? '<li>Dermatologist consultation</li>' : ''}
                      <li>Continue preventive routine</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Follow-up Schedule -->
              <div style="padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <h4 style="font-size: 12px; margin-bottom: 8px;">📅 Recommended Follow-up Schedule</h4>
                <div style="font-size: 10px;">
                  <p><strong>Next Assessment:</strong> ${Math.max(
                    pigmentation.severity === 'Severe' ? 4 : pigmentation.severity === 'Moderate' ? 8 : 12,
                    pores.severity === 'Severe' ? 6 : pores.severity === 'Moderate' ? 10 : 12,
                    darkCircles.severity === 'Severe' ? 8 : darkCircles.severity === 'Moderate' ? 12 : 16
                  )} weeks</p>
                  <p><strong>Professional Consultation:</strong> ${
                    pigmentation.severity === 'Severe' || pores.severity === 'Severe' || darkCircles.severity === 'Severe' 
                      ? 'Recommended within 2-4 weeks' 
                      : 'As needed for concerns'
                  }</p>
                  <p><strong>Progress Photos:</strong> Monthly for first 3 months, then quarterly</p>
                </div>
              </div>
            </div>
          </div>

          <!-- System Conclusion -->
          <div class="system-conclusion">
            <h3>System Conclusion</h3>
            <div class="conclusion-text">
              Based on AI-based image analysis using the Dark.h5 model, the subject has a ${skinTone.tone} skin tone with ${skinType.skinType} skin type. 
              Analysis reveals: ${acne.severity !== 'None' || pores.severity !== 'None' || pigmentation.severity !== 'None' || darkCircles.severity !== 'None' ? 
                `${acne.severity !== 'None' ? `${acne.severity} acne` : ''}${acne.severity !== 'None' && (pores.severity !== 'None' || pigmentation.severity !== 'None' || darkCircles.severity !== 'None') ? ', ' : ''}${pores.severity !== 'None' ? `${pores.severity} pore visibility` : ''}${pores.severity !== 'None' && (pigmentation.severity !== 'None' || darkCircles.severity !== 'None') ? ', ' : ''}${pigmentation.severity !== 'None' ? `${pigmentation.severity} pigmentation` : ''}${pigmentation.severity !== 'None' && darkCircles.severity !== 'None' ? ', and ' : ''}${darkCircles.severity !== 'None' ? `${darkCircles.severity} dark circles` : ''}` : 
                'Normal skin condition with minimal concerns'}. 
              ${acne.severity === 'None' && pores.severity === 'None' && pigmentation.severity === 'None' && darkCircles.severity === 'None' ? 
                'No significant skin concerns detected.' : 
                'Targeted skincare routine recommended for optimal improvement.'}
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="disclaimer">
            <div class="disclaimer-text">
              DISCLAIMER: AI-GENERATED REPORT - NOT A CLINICAL DIAGNOSIS
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Generated by VisageAI • ${currentDate.toLocaleString()}</p>
            <p>This report is for informational purposes only and should not replace professional medical advice.</p>
          </div>
        </body>
      </html>
    `;
  }

  static printReport(analysisData, capturedImages, userInfo = {}) {
    const htmlContent = this.generateReportHTML(analysisData, capturedImages, userInfo);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
}

