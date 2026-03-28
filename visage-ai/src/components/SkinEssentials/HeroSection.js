import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  // Use image from public folder
  const skinEssentialsImage = '/skin-essentials.png';
  
  // Debug: Check if image is loaded
  console.log('Skin Essentials Image Path:', skinEssentialsImage);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      paddingTop: '80px' // Account for fixed navbar
    }}>
      {/* Back to Home Button */}
      <div style={{
        position: 'absolute',
        top: '100px', // Below the navbar (80px) + some spacing
        left: '20px',
        zIndex: 20
      }}>
        <button 
          onClick={() => navigate('/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            border: '1px solid rgba(217, 115, 152, 0.2)',
            color: 'var(--foreground)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(217, 115, 152, 0.1)';
            e.target.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <span style={{ fontSize: '16px' }}>←</span>
          Back to Home
        </button>
      </div>

      {/* Background with image */}
      <div style={{
        position: 'absolute',
        inset: 0
      }}>
        {/* Full screen background image - edge to edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden'
        }}>
          <img 
            src={skinEssentialsImage} 
            alt="Skin Essentials Products"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onLoad={() => console.log('Image loaded successfully')}
            onError={(e) => console.log('Image failed to load:', e)}
          />
        </div>
        
        {/* Overlay gradient for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(250, 248, 246, 0.95) 0%, rgba(250, 248, 246, 0.85) 30%, rgba(250, 248, 246, 0.6) 50%, rgba(250, 248, 246, 0.3) 70%, rgba(250, 248, 246, 0.1) 100%)',
          zIndex: 2
        }} />
      </div>

      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '40px',
        width: '288px',
        height: '288px',
        background: 'rgba(217, 115, 152, 0.1)',
        borderRadius: '50%',
        filter: 'blur(48px)',
        zIndex: 3
      }} />
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '40px',
        width: '384px',
        height: '384px',
        background: 'rgba(212, 196, 224, 0.2)',
        borderRadius: '50%',
        filter: 'blur(48px)',
        zIndex: 3
      }} />

      <div className="container-tight" style={{
        position: 'relative',
        zIndex: 10,
        padding: '128px 16px 80px',
        paddingTop: '160px',
        display: 'flex',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div style={{ 
          maxWidth: '600px',
          width: '100%'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '8px 16px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--primary)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '9999px',
            border: '1px solid rgba(217, 115, 152, 0.3)',
            animation: 'fadeIn 0.6s ease-out',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            Your Guide to Healthy Skin
          </span>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '600',
            lineHeight: '1.2',
            marginBottom: '24px',
            animation: 'fadeIn 0.6s ease-out 0.1s both',
            color: 'var(--foreground)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Skincare Essentials for{" "}
            <span className="text-gradient">Healthy, Glowing</span>{" "}
            Skin
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            maxWidth: '480px',
            marginBottom: '40px',
            animation: 'fadeIn 0.6s ease-out 0.2s both',
            lineHeight: '1.6',
            padding: '0',
            background: 'transparent'
          }}>
            Discover the essential products every skincare routine needs. 
            Science-backed information for every skin type.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            animation: 'fadeIn 0.6s ease-out 0.3s both',
            flexWrap: 'wrap',
            background: 'transparent',
            padding: '0'
          }}>
            <div>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                color: 'var(--foreground)'
              }}>5</div>
              <div style={{
                fontSize: '12px',
                color: 'var(--muted-foreground)'
              }}>Essential Products</div>
            </div>
            <div style={{
              width: '1px',
              height: '48px',
              background: 'var(--border)'
            }} />
            <div>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                color: 'var(--foreground)'
              }}>All</div>
              <div style={{
                fontSize: '12px',
                color: 'var(--muted-foreground)'
              }}>Skin Types</div>
            </div>
            <div style={{
              width: '1px',
              height: '48px',
              background: 'var(--border)'
            }} />
            <div>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                color: 'var(--foreground)'
              }}>100%</div>
              <div style={{
                fontSize: '12px',
                color: 'var(--muted-foreground)'
              }}>Research Based</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;