import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll effect and responsive detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial mobile state
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        style={{
          width: '100%',
          background: isScrolled 
            ? 'linear-gradient(90deg, rgba(24,49,83,0.98) 60%, rgba(26,54,93,0.98) 100%)'
            : 'linear-gradient(90deg, #183153 60%, #1a365d 100%)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          color: '#fff',
          padding: '0.75rem clamp(1rem, 4vw, 2rem)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(24,49,83,0.2)' 
            : '0 2px 8px rgba(24,49,83,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: isMobile ? 70 : 60,
          gap: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Logo Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 16px)', 
          minWidth: 0,
          flex: '1 1 auto',
          zIndex: 1001
        }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            gap: 'clamp(8px, 2vw, 12px)',
            minHeight: 44,
            padding: '4px',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              width: 'clamp(36px, 8vw, 48px)',
              height: 'clamp(36px, 8vw, 48px)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(255,152,0,0.3)',
            }}>
              <img 
                src="/logo.png" 
                alt="J.I. Heating & Cooling Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <span style={{ 
                fontWeight: 700, 
                fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
                letterSpacing: '0.02em', 
                color: '#fff', 
                fontFamily: 'Inter, system-ui, sans-serif', 
                whiteSpace: 'nowrap', 
                textShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                lineHeight: 1.1
              }}>
                J.I. <span style={{ 
                  color: '#ff9800', 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ff9800, #ff6f00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Heating & Cooling</span>
              </span>
              {!isMobile && (
                <span style={{
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 400,
                  letterSpacing: '0.5px'
                }}>
                  Professional HVAC Services
                </span>
              )}
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav 
          style={{
            display: !isMobile ? 'flex' : 'none',
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 16px)',
          }}
        >
          {['Home', 'Services', 'About', 'Contact'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                fontWeight: 600, 
                fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                padding: '0.75rem 1rem', 
                borderRadius: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }} 
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {item}
            </Link>
          ))}
          <Link 
            to="/emergency" 
            style={{ 
              color: '#fff', 
              background: 'linear-gradient(135deg, #dc3545, #c82333)', 
              borderRadius: '12px', 
              padding: '0.75rem 1.5rem', 
              fontWeight: 700, 
              fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
              textDecoration: 'none', 
              boxShadow: '0 4px 20px rgba(220,53,69,0.3)', 
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }} 
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 30px rgba(220,53,69,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 20px rgba(220,53,69,0.3)';
            }}
          >
            🚨 Emergency
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-container"
          onClick={toggleMobileMenu}
          style={{
            display: isMobile ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '48px',
            height: '48px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1001,
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <div style={{
            width: '24px',
            height: '2px',
            background: '#fff',
            borderRadius: '2px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isMobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
          }} />
          <div style={{
            width: '24px',
            height: '2px',
            background: '#fff',
            borderRadius: '2px',
            margin: '4px 0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isMobileMenuOpen ? 0 : 1,
            transform: isMobileMenuOpen ? 'scale(0)' : 'scale(1)',
          }} />
          <div style={{
            width: '24px',
            height: '2px',
            background: '#fff',
            borderRadius: '2px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
          }} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="mobile-menu-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: isMobile ? 'block' : 'none'
        }}
      >
        {/* Mobile Menu Content */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: `translateX(-50%) ${isMobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)'}`,
            background: 'linear-gradient(135deg, #183153, #1a365d)',
            borderRadius: '24px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Mobile Menu Header with Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(255,152,0,0.3)',
            }}>
              <img 
                src="/logo.png" 
                alt="J.I. Heating & Cooling Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '10px',
                }}
              />
            </div>
            <div>
              <div style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff',
                lineHeight: 1.2
              }}>
                J.I. <span style={{
                  color: '#ff9800',
                  fontWeight: 800
                }}>Heating & Cooling</span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 400
              }}>
                Professional HVAC Services
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Home', path: '/', icon: '🏠' },
              { name: 'Services', path: '/services', icon: '🔧' },
              { name: 'About', path: '/about', icon: '👥' },
              { name: 'Contact', path: '/contact', icon: '📞' }
            ].map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100px)',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transitionDelay: isMobileMenuOpen ? `${index * 0.1}s` : '0s'
                }}
                onTouchStart={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'scale(0.98)';
                }}
                onTouchEnd={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Emergency Button */}
            <Link
              to="/emergency"
              onClick={closeMobileMenu}
              style={{
                color: '#fff',
                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                fontWeight: 700,
                fontSize: '1.1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(220,53,69,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginTop: '1rem',
                border: '2px solid rgba(255,255,255,0.2)',
                transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100px)',
                opacity: isMobileMenuOpen ? 1 : 0,
                transitionDelay: isMobileMenuOpen ? '0.4s' : '0s'
              }}
              onTouchStart={(e) => {
                e.target.style.transform = 'scale(0.95)';
                e.target.style.boxShadow = '0 4px 20px rgba(220,53,69,0.6)';
              }}
              onTouchEnd={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 32px rgba(220,53,69,0.4)';
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>🚨</span>
              Emergency Service
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;