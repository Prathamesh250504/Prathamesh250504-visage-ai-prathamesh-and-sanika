import React from 'react';

// Import skincare product photos for background
import bannerPhoto from '../../assets/banner.jpeg';
import coverPhoto from '../../assets/cover.jpeg';
import faceCleanserPhoto from '../../assets/face cleanser.jpeg';
import lipNurshingPhoto from '../../assets/lip nurshing.jpeg';
import lipPhoto from '../../assets/lip.jpeg';
import lipbalmPhoto from '../../assets/lipbalm.jpeg';
import liptintPhoto from '../../assets/liptint.jpeg';
import moisturizerPhoto from '../../assets/moisturizer.jpeg';
import nightCreamPhoto from '../../assets/night cream.jpeg';
import productPhoto from '../../assets/product.jpeg';
import rosePhoto from '../../assets/rose.jpeg';
import serumPhoto from '../../assets/serum.jpeg';
import serum2Photo from '../../assets/serum2.jpeg';
import tonerPhoto from '../../assets/toner.jpeg';
import visageCoverPhoto from '../../assets/visage cover.jpeg';
import sunscreenPhoto from '../../assets/sunscreen.jpeg';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Photo Banner */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 1,
        opacity: 0.15
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          animation: 'scrollRight 70s linear infinite',
          width: 'calc(200% + 1rem)',
          height: '100%',
          alignItems: 'center'
        }}>
          {/* First set of photos */}
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={bannerPhoto} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={coverPhoto} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={faceCleanserPhoto} alt="Face Cleanser" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={lipNurshingPhoto} alt="Lip Nourishing" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={lipPhoto} alt="Lip" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={lipbalmPhoto} alt="Lip Balm" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={liptintPhoto} alt="Lip Tint" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={moisturizerPhoto} alt="Moisturizer" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={nightCreamPhoto} alt="Night Cream" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={productPhoto} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={rosePhoto} alt="Rose" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={serumPhoto} alt="Serum" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={serum2Photo} alt="Serum 2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={tonerPhoto} alt="Toner" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={visageCoverPhoto} alt="Visage Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={sunscreenPhoto} alt="Sunscreen" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={bannerPhoto} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={coverPhoto} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={faceCleanserPhoto} alt="Face Cleanser" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={lipNurshingPhoto} alt="Lip Nourishing" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={lipPhoto} alt="Lip" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={lipbalmPhoto} alt="Lip Balm" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={liptintPhoto} alt="Lip Tint" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={moisturizerPhoto} alt="Moisturizer" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={nightCreamPhoto} alt="Night Cream" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={productPhoto} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={rosePhoto} alt="Rose" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={serumPhoto} alt="Serum" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={serum2Photo} alt="Serum 2" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={tonerPhoto} alt="Toner" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={visageCoverPhoto} alt="Visage Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
          <div style={{ flexShrink: 0, width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={sunscreenPhoto} alt="Sunscreen" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
          </div>
        </div>
      </div>

      <div className="container-tight" style={{
        padding: '64px 16px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Bottom */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--muted-foreground)'
          }}>
            © 2025 VisageAI. All rights reserved.
          </p>
          <p style={{
            fontSize: '14px',
            color: 'var(--muted-foreground)'
          }}>
            Educational content for healthy, glowing skin
          </p>
        </div>

        {/* Products Page Style Disclaimer */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'var(--muted)',
          borderRadius: 'var(--radius)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--muted-foreground)',
            lineHeight: '1.5',
            margin: 0
          }}>
            Disclaimer: This skincare information is for educational purposes only and should not replace professional dermatological advice. 
            Always patch test new products and consult with a dermatologist for personalized skincare recommendations.
            Made with ❤️ for healthy, glowing skin.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;