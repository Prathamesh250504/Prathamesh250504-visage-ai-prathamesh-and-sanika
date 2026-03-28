import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Products", href: "#products" },
    { name: "Skin Types", href: "#skin-types" },
    { name: "Benefits", href: "#benefits" },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(254, 254, 254, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(232, 224, 220, 0.5)'
    }}>
      <div className="container-tight" style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>
          {/* Logo */}
          <button 
            onClick={() => navigate('/home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--blush))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: 'white',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>S</span>
            </div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '20px',
              fontWeight: '500',
              color: 'var(--foreground)'
            }}>SkinEssentials</span>
          </button>

          {/* Desktop navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }} className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--muted-foreground)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--foreground)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--muted-foreground)'}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            style={{
              display: 'block',
              padding: '8px',
              marginRight: '-8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div style={{
            display: 'block',
            paddingBottom: '16px',
            borderTop: '1px solid var(--border)',
            animation: 'fadeIn 0.3s ease-out'
          }} className="mobile-menu">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              paddingTop: '16px'
            }}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--muted-foreground)',
                    textDecoration: 'none',
                    padding: '8px 0',
                    transition: 'color 0.3s ease'
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => e.target.style.color = 'var(--foreground)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--muted-foreground)'}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;