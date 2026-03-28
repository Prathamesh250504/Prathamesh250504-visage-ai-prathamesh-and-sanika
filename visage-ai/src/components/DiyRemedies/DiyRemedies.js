import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiyRemedies.module.css";

// Images from src/assets
import img4 from "../../assets/4.webp";
import img5 from "../../assets/5.webp";
import img6 from "../../assets/6.jpg";
import img7 from "../../assets/7.avif";
import img8 from "../../assets/8.jpg";
import img9 from "../../assets/9.jpg";
import img10 from "../../assets/10.jpg";
import img11 from "../../assets/11.gif";
import img12 from "../../assets/12.jpg";
import img13 from "../../assets/13.jpg";

const DiyRemedies = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className={styles.diyRemedies}>
      <header>
        <h1>🌿 DIY Remedies 🌿</h1>
        
        {/* Back to Home Button - Similar to Skin Essentials */}
        <div className={styles.backButtonWrapper}>
          <button 
            onClick={handleBackToHome}
            className={styles.backToHomeButton}
          >
            <span className={styles.backArrow}>←</span>
            Back to Home
          </button>
        </div>
      </header>

      <section>
        <h2>Understanding Your Dosha</h2>
        <p>
          Ayurveda views skin health as a reflection of one's <strong>dosha</strong> balance –
          Vata, Pitta, and Kapha. Each has distinct characteristics:
        </p>
        <ul>
          <li><strong>Vata (Air/Ether):</strong> Cold, dry, rough. Thin, delicate skin that wrinkles when dehydrated.</li>
          <li><strong>Pitta (Fire/Water):</strong> Warm, oily skin. Prone to acne, sunburn, and redness. Needs cooling herbs.</li>
          <li><strong>Kapha (Water/Earth):</strong> Cool, oily, heavy skin. Thick and moist but can get congested. Needs exfoliation.</li>
        </ul>
        <div className={styles.doshaImages}>
          <img src={img11} alt="Dosha Type 1" />
          <img src={img13} alt="Dosha Type 2" />
          <img src={img12} alt="Dosha Type 3" />
        </div>
      </section>

      <section className={styles.remedy}>
        <h2>🧴 Ayurvedic DIY Remedies by Skin Concern</h2>

        <h3>Acne / Pimples</h3>
        <img src={img4} alt="Turmeric Neem Mask" />
        <ul>
          <li><strong>Neem & Turmeric:</strong> Anti-bacterial, reduces inflammation.</li>
          <li><strong>Sandalwood & Rosewater:</strong> Soothes acne-prone skin.</li>
          <li><strong>Honey & Cinnamon:</strong> Spot treatment with antibacterial properties.</li>
        </ul>

        <h3>Pigmentation / Dark Spots</h3>
        <img src={img5} alt="Turmeric Milk Mask" />
        <ul>
          <li><strong>Turmeric + Milk/Yogurt:</strong> Lightens spots.</li>
          <li><strong>Licorice Paste:</strong> Reduces melanin with glabridin.</li>
          <li><strong>Aloe + Sandalwood:</strong> Cools and soothes.</li>
        </ul>

        <h3>Dryness & Flaking</h3>
        <img src={img6} alt="Avocado Honey Mask" />
        <ul>
          <li><strong>Avocado & Honey:</strong> Deeply nourishes Vata skin.</li>
          <li><strong>Yogurt & Oatmeal:</strong> Hydrates and soothes irritation.</li>
          <li><strong>Almond Oil Massage:</strong> Locks in moisture and restores glow.</li>
        </ul>

        <h3>Aging & Fine Lines</h3>
        <ul>
          <li><strong>Gotu Kola Mask:</strong> Improves elasticity and firmness.</li>
          <li><strong>Amla Paste:</strong> Vitamin C-rich for collagen boost.</li>
          <li><strong>Triphala Pack:</strong> Exfoliates and rejuvenates.</li>
        </ul>

        <h3>Dullness & Uneven Tone</h3>
        <ul>
          <li><strong>Gram Flour Ubtan:</strong> Cleanses and brightens skin tone.</li>
          <li><strong>Rice Flour / Coffee Scrub:</strong> Exfoliates and boosts circulation.</li>
          <li><strong>Orange Peel / Papaya Pack:</strong> Natural enzymes for glow.</li>
        </ul>

        <h3>Radiance & Glow</h3>
        <img src={img7} alt="Glow Mask" />
        <ul>
          <li><strong>Saffron Milk Toner:</strong> Antioxidant-rich for brightness.</li>
          <li><strong>Multani Mitti & Turmeric:</strong> Detoxifies and enhances glow.</li>
          <li><strong>Banana & Honey:</strong> Nourishes skin deeply.</li>
        </ul>
      </section>

      <section>
        <h2>🌿 Herbal & Natural Ingredients</h2>
        <table>
          <thead>
            <tr>
              <th>Ingredient</th><th>Benefits</th><th>Form</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Turmeric</td><td>Reduces inflammation & pigmentation</td><td>Powder/mask</td></tr>
            <tr><td>Neem</td><td>Antibacterial, clears acne</td><td>Powder or oil</td></tr>
            <tr><td>Aloe Vera</td><td>Soothes and hydrates</td><td>Fresh gel</td></tr>
            <tr><td>Sandalwood</td><td>Cooling & antiseptic</td><td>Powder/paste</td></tr>
            <tr><td>Licorice</td><td>Brightens and soothes</td><td>Powder/paste</td></tr>
            <tr><td>Honey</td><td>Moisturizes & fights acne</td><td>Raw in masks</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>🪔 Daily & Seasonal Ayurvedic Routines</h2>
        <ul>
          <li><strong>Daily Abhyanga (Oil Massage):</strong> Sesame for all doshas, almond for Vata/Pitta.</li>
          <li><strong>Vata Skin:</strong> Use rich oils and warming masks.</li>
          <li><strong>Pitta Skin:</strong> Use aloe/sandalwood in hot seasons.</li>
          <li><strong>Kapha Skin:</strong> Exfoliate regularly, avoid heavy creams.</li>
        </ul>
      </section>

      <section>
        <h2>🧴 Ayurvedic Skincare Brands</h2>
        <table>
          <thead>
            <tr><th>Brand</th><th>Product</th><th>Key Ingredients</th></tr>
          </thead>
          <tbody>
            <tr><td>Forest Essentials</td><td>Silk Moisturizer</td><td>Sandalwood, Vetiver</td></tr>
            <tr><td>Kama Ayurveda</td><td>Kumkumadi Oil</td><td>Saffron, Licorice, Manjistha</td></tr>
            <tr><td>Patanjali</td><td>Aloe Vera Gel</td><td>Aloe, Neem, Tulsi</td></tr>
            <tr><td>Himalaya</td><td>Neem Face Wash</td><td>Neem, Turmeric</td></tr>
            <tr><td>Weleda</td><td>Skin Food</td><td>Chamomile, Calendula</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>🧘 Integrating Ayurveda into Modern Life</h2>
        <ul>
          <li>Start with one habit: oil massage or weekly mask.</li>
          <li>Balance your dosha through diet and rest.</li>
          <li>Use natural ingredients and avoid chemicals.</li>
          <li>For chronic skin issues, consult an Ayurvedic practitioner.</li>
        </ul>
        <div className={styles.ayurvedaImages}>
          <img src={img8} alt="Ayurvedic Lifestyle 1" />
          <img src={img9} alt="Ayurvedic Lifestyle 2" />
          <img src={img10} alt="Ayurvedic Lifestyle 3" />
        </div>
      </section>

      <footer style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderTop: '2px solid #10b981'
      }}>
        {/* Background with natural ingredients */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0.2
        }}>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            animation: 'scrollRight 90s linear infinite',
            width: 'calc(200% + 1.5rem)',
            height: '100%',
            alignItems: 'center'
          }}>
            {/* Natural ingredients images */}
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img4} alt="Turmeric" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img5} alt="Milk" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img6} alt="Avocado" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img7} alt="Glow" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img8} alt="Ayurvedic" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img9} alt="Natural" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img10} alt="Herbs" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img11} alt="Dosha" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img12} alt="Remedies" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img13} alt="Natural Care" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img4} alt="Turmeric" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img5} alt="Milk" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img6} alt="Avocado" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img7} alt="Glow" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img8} alt="Ayurvedic" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img9} alt="Natural" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img10} alt="Herbs" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img11} alt="Dosha" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img12} alt="Remedies" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
            <div style={{ flexShrink: 0, width: '120px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img13} alt="Natural Care" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%)' }} />
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#065f46',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
          }}>
            &copy; 2025 VisageAI. All rights reserved. 
          </p>
          <p style={{ 
            margin: '8px 0 0 0', 
            fontSize: '14px', 
            color: '#047857',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
          }}>
            Designed with ❤️ by <strong>Sanika Nayakal</strong> & <strong>Prathamesh Pabe</strong>
          </p>
          <p style={{ 
            margin: '12px 0 0 0', 
            fontSize: '12px', 
            color: '#059669',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
          }}>
            🌿 Natural beauty through ancient wisdom 🌿
          </p>
        </div>

        <style jsx>{`
          @keyframes scrollRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </footer>
    </div>
  );
};

export default DiyRemedies;
