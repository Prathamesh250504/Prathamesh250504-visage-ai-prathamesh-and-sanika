import React from 'react';

const trustBadges = [
  {
    icon: "🔬",
    title: "Science-Based",
    description: "All information backed by dermatological research",
  },
  {
    icon: "🌍",
    title: "For All Skin Tones",
    description: "Guidance suitable for every skin type and tone",
  },
  {
    icon: "🛡️",
    title: "Clean Beauty Focus",
    description: "Emphasis on safe, effective ingredients",
  },
  {
    icon: "💖",
    title: "Cruelty Free",
    description: "Promoting ethical beauty practices",
  },
  {
    icon: "🌿",
    title: "Eco-Conscious",
    description: "Sustainable skincare recommendations",
  },
  {
    icon: "🏆",
    title: "Expert Curated",
    description: "Information reviewed by skincare professionals",
  },
];

const TrustSection = () => {
  return (
    <section className="section-padding" id="benefits" style={{
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, var(--card), var(--background), var(--card))'
      }} />

      <div className="container-tight" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '768px',
          margin: '0 auto 64px'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 16px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--primary)',
            background: 'rgba(217, 115, 152, 0.1)',
            borderRadius: '9999px'
          }}>
            Our Values
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            Trust & Transparency
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6'
          }}>
            We believe in honest, science-backed skincare education. 
            Every recommendation is based on research and dermatological best practices.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {trustBadges.map((badge, index) => (
            <div
              key={badge.title}
              style={{
                padding: '24px',
                textAlign: 'center',
                background: 'var(--card)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animationDelay: `${index * 0.1}s`
              }}
              className="animate-fade-in"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(44, 44, 44, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(217, 115, 152, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(217, 115, 152, 0.1), rgba(212, 196, 224, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transition: 'transform 0.3s ease'
              }}>
                {badge.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '500',
                marginBottom: '8px'
              }}>{badge.title}</h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted-foreground)'
              }}>{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;