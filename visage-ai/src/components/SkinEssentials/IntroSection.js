import React from 'react';

const benefits = [
  {
    icon: "💧",
    title: "Deep Hydration",
    description: "Lock in moisture for plump, healthy-looking skin all day long",
    color: "var(--mint-light)",
  },
  {
    icon: "🛡️",
    title: "Barrier Protection",
    description: "Strengthen your skin's natural defense against environmental stressors",
    color: "var(--lavender-light)",
  },
  {
    icon: "✨",
    title: "Repair & Renew",
    description: "Support cell turnover for smoother, more radiant complexion",
    color: "var(--blush-light)",
  },
  {
    icon: "☀️",
    title: "UV Defense",
    description: "Daily protection against sun damage and premature aging",
    color: "var(--cream)",
  },
];

const IntroSection = () => {
  return (
    <section className="section-padding" style={{
      background: 'var(--card)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(217, 115, 152, 0.2), transparent)'
      }} />
      
      <div className="container-tight">
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
            Why Skincare Matters
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            The Foundation of Beautiful Skin
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            lineHeight: '1.6'
          }}>
            Consistent skincare isn't just about looking good—it's about protecting your skin barrier, 
            preventing damage, and investing in your long-term skin health. A proper routine can transform 
            your skin from the inside out.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="glass-card-hover"
              style={{
                padding: '24px',
                textAlign: 'center',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '16px',
                background: benefit.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transition: 'transform 0.3s ease'
              }}>
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '500',
                marginBottom: '8px'
              }}>{benefit.title}</h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted-foreground)',
                lineHeight: '1.5'
              }}>{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{
          marginTop: '80px',
          textAlign: 'center'
        }}>
          <blockquote style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            color: 'var(--muted-foreground)',
            maxWidth: '512px',
            margin: '0 auto'
          }}>
            "Great skin doesn't happen by chance, it happens by appointment with the right products."
          </blockquote>
          <p style={{
            marginTop: '16px',
            fontSize: '14px',
            color: 'var(--muted-foreground)'
          }}>— Skincare Philosophy</p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;