import React from 'react';

const FooterCTA = () => {
  return (
    <section className="section-padding" style={{
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-hero)'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-glow)'
      }} />
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        width: '128px',
        height: '128px',
        background: 'rgba(217, 115, 152, 0.1)',
        borderRadius: '50%',
        filter: 'blur(32px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '40px',
        width: '160px',
        height: '160px',
        background: 'rgba(212, 196, 224, 0.2)',
        borderRadius: '50%',
        filter: 'blur(32px)'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '25%',
        width: '96px',
        height: '96px',
        background: 'rgba(196, 224, 212, 0.15)',
        borderRadius: '50%',
        filter: 'blur(24px)'
      }} />

      <div className="container-tight" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Main heading */}
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '500',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Beautiful Skin Starts with{" "}
            <span className="text-gradient">Knowledge</span>
          </h2>

          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'var(--muted-foreground)',
            marginBottom: '40px',
            maxWidth: '512px',
            margin: '0 auto 40px'
          }}>
            Understanding your skin and using the right products consistently 
            is the key to achieving healthy, radiant skin. Start your journey today.
          </p>

          {/* Key takeaways */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                color: 'var(--primary)',
                marginBottom: '8px'
              }}>1</div>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted-foreground)'
              }}>Cleanse daily to remove impurities</p>
            </div>
            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                color: 'var(--primary)',
                marginBottom: '8px'
              }}>2</div>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted-foreground)'
              }}>Moisturize to maintain skin barrier</p>
            </div>
            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                color: 'var(--primary)',
                marginBottom: '8px'
              }}>3</div>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted-foreground)'
              }}>Sunscreen every day, rain or shine</p>
            </div>
          </div>

          {/* Trust text */}
          <p style={{
            marginTop: '40px',
            fontSize: '14px',
            color: 'var(--muted-foreground)'
          }}>
            Consistency is key • Results take 4-8 weeks • Listen to your skin
          </p>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(217, 115, 152, 0.2), transparent)'
      }} />
    </section>
  );
};

export default FooterCTA;