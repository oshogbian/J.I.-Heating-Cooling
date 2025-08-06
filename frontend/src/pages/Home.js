import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFan, FaSnowflake, FaWind, FaPhoneAlt, FaExclamationTriangle, FaCalendarCheck, FaArrowRight, FaCheck } from 'react-icons/fa';

const serviceData = [
  {
    key: 'fan',
    icon: <FaFan size={48} color="var(--color-primary)" style={{ marginBottom: 14 }} />,
    title: 'Fan Coil',
    subtitle: 'Professional Condo HVAC Solutions',
    color: 'var(--color-primary)',
    video: '/condofan.mp4',
    summary: [
      'Install, repair & maintain condo fan coil units',
      'Optimal comfort & air quality',
      'Fast, clean, reliable',
    ],
    why: [
      'Buildup reduces air quality and efficiency',
      'Risk of leaks and costly breakdowns', 
      'Regular service keeps your home healthy'
    ],
    timeframe: 'Recommended: Service twice a year',
    features: ['Professional Installation', 'Preventive Maintenance', 'Emergency Repairs', 'Air Quality Optimization']
  },
  {
    key: 'heat',
    icon: <FaSnowflake size={48} color="#1976d2" style={{ marginBottom: 14 }} />,
    title: 'Heat Pump',
    subtitle: 'High-Efficiency Climate Control',
    color: '#1976d2',
    video: '/heatpump1.mp4',
    summary: [
      'High-efficiency installation & maintenance',
      'Year-round savings & comfort',
      'Energy-saving solutions',
    ],
    why: [
      'Ensures maximum efficiency and performance',
      'Prevents costly repairs and breakdowns',
      'Extends system lifespan significantly'
    ],
    timeframe: 'Recommended: Maintenance once a year',
    features: ['Energy-Efficient Installation', 'Regular Maintenance', 'Performance Optimization', 'Cost Savings']
  },
  {
    key: 'vent',
    icon: <FaWind size={48} color="#00bcd4" style={{ marginBottom: 14 }} />,
    title: 'Vent Cleaning',
    subtitle: 'Professional Air Quality Services',
    color: '#00bcd4',
    video: '/vent cleaning.mp4',
    summary: [
      'Professional vent & dryer vent cleaning',
      'Prevents fire hazards',
      'Healthier home, cleaner air',
    ],
    why: [
      'Improves air quality and health',
      'Reduces fire risk and prevents blockages',
      'Maintains optimal system performance'
    ],
    timeframe: 'Recommended: Clean once a year',
    features: ['Comprehensive Cleaning', 'Fire Safety', 'Health Benefits', 'Performance Restoration']
  },
];

function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function Home() {
  return (
    <div style={{
      scrollBehavior: 'smooth',
      scrollSnapType: 'y mandatory'
    }}>
      <section style={{
        position: 'relative',
        minHeight: '420px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-gradient)',
        padding: 0,
        overflow: 'hidden',
      }}>
        {/* Video background */}
        <video
          src="/vid.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            minHeight: '420px',
          }}
          poster="/logo.png"
        />
        {/* Gradient overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(24,49,83,0.55) 0%, rgba(24,49,83,0.25) 60%, rgba(24,49,83,0.65) 100%)',
          zIndex: 2,
        }} />
        {/* Hero content overlay */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 8vw, 4.5rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 6vw, 2.5rem) clamp(1rem, 4vw, 2rem)',
        }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            borderRadius: '50px',
            marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
            backdropFilter: 'blur(10px)',
            fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#fff',
            textAlign: 'center'
          }}>
            Proudly Serving Toronto & GTA Condos
          </div>
          <h1 style={{ 
            fontSize: 'clamp(1.75rem, 6vw, 2.8rem)', 
            color: 'var(--color-text-light)', 
            margin: 0, 
            letterSpacing: 'clamp(1px, 0.5vw, 2px)', 
            fontWeight: 800, 
            textShadow: '0 2px 8px rgba(24,49,83,0.10)', 
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '100%'
          }}>
            Your Trusted Partner for Condo HVAC in Toronto
          </h1>
          <div style={{ 
            width: 'clamp(40px, 10vw, 60px)', 
            height: 3, 
            background: 'var(--color-secondary)', 
            borderRadius: 2, 
            margin: 'clamp(12px, 3vw, 18px) auto clamp(10px, 2.5vw, 14px) auto', 
            opacity: 0.85 
          }} />
          <p style={{ 
            fontSize: 'clamp(0.9rem, 3vw, 1.13rem)', 
            color: '#e0e0e0', 
            marginBottom: 'clamp(1.5rem, 6vw, 32px)', 
            fontWeight: 500, 
            fontStyle: 'italic', 
            letterSpacing: '0.04em', 
            textShadow: '0 1px 4px rgba(24,49,83,0.10)', 
            textAlign: 'center', 
            maxWidth: 'clamp(280px, 80vw, 600px)', 
            lineHeight: 1.6 
          }}>
            Expert installation, repair, and maintenance of fan coil units, heat pumps, and ventilation systems ensure superior comfort, significant energy savings, and pristine air quality for your condo. Direct access to the owner, Sam. No call centers, no runaround—just real help when you need it.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(8px, 2vw, 18px)', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            width: '100%',
            maxWidth: 'clamp(280px, 90vw, 600px)'
          }}>
            <a 
              href="tel:+14169979123" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'var(--color-secondary)', 
                color: '#fff', 
                padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.25rem, 4vw, 2.5rem)', 
                borderRadius: 10, 
                fontSize: 'clamp(0.9rem, 3vw, 1.22rem)', 
                fontWeight: 700, 
                textDecoration: 'none', 
                boxShadow: '0 2px 8px rgba(255,111,0,0.10)', 
                transition: 'background 0.2s', 
                gap: 'clamp(6px, 2vw, 12px)', 
                letterSpacing: '0.02em',
                minHeight: 44,
                justifyContent: 'center',
                flex: '1 1 auto',
                minWidth: 'clamp(120px, 40vw, 200px)'
              }}
            >
              <FaPhoneAlt style={{ fontSize: 'clamp(16px, 4vw, 20px)' }} /> 
              <span style={{ marginLeft: 'clamp(4px, 1vw, 6px)' }}>Call Sam Now</span>
            </a>
            <Link 
              to="/services" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'var(--color-primary)', 
                color: '#fff', 
                border: '2px solid var(--color-primary)', 
                borderRadius: 10, 
                padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.25rem, 4vw, 2.5rem)', 
                fontWeight: 700, 
                fontSize: 'clamp(0.9rem, 3vw, 1.18rem)', 
                textDecoration: 'none', 
                boxShadow: '0 1px 4px rgba(24,49,83,0.10)', 
                gap: 'clamp(6px, 2vw, 10px)', 
                transition: 'background 0.2s, color 0.2s', 
                letterSpacing: '0.02em',
                minHeight: 44,
                justifyContent: 'center',
                flex: '1 1 auto',
                minWidth: 'clamp(120px, 40vw, 200px)'
              }}
            >
              <FaCalendarCheck style={{ fontSize: 'clamp(16px, 4vw, 20px)' }} /> 
              <span style={{ marginLeft: 'clamp(4px, 1vw, 6px)' }}>Book Service</span>
            </Link>
            <Link 
              to="/emergency" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#fff', 
                color: 'var(--color-emergency)', 
                border: '2px solid var(--color-emergency)', 
                borderRadius: 10, 
                padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.25rem, 4vw, 2.5rem)', 
                fontWeight: 700, 
                fontSize: 'clamp(0.9rem, 3vw, 1.18rem)', 
                textDecoration: 'none', 
                boxShadow: '0 1px 4px rgba(220,53,69,0.10)', 
                gap: 'clamp(6px, 2vw, 10px)', 
                transition: 'background 0.2s, color 0.2s', 
                letterSpacing: '0.02em',
                minHeight: 44,
                justifyContent: 'center',
                flex: '1 1 auto',
                minWidth: 'clamp(120px, 40vw, 200px)'
              }}
            >
              <FaExclamationTriangle style={{ fontSize: 'clamp(16px, 4vw, 20px)' }} /> 
              <span style={{ marginLeft: 'clamp(4px, 1vw, 6px)' }}>Emergency</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section style={{ 
        background: 'rgba(255,255,255,0.95)',
        padding: '3rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTouchDevice() ? '1fr' : 'repeat(3, 1fr)',
            gap: '2rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                100+
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>
                  Condos Served
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  Deep understanding of condo building systems
                </p>
              </div>
            </div>



            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                ⚡
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>
                  Emergency Service
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  Reliable emergency services when you need them most
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                2015
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>
                  Years of Experience
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  Family-owned business serving GTA since 2015
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Professional Services Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        padding: '8rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isTouchDevice() ? '0 1rem' : '0 2rem' }}>
          {/* Enhanced Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '0.5rem 2rem',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.5rem'
            }}>
              Our Expertise
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: 'var(--color-primary)',
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}>
              Comprehensive Condo HVAC Solutions
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666', 
              maxWidth: 700, 
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              From installation to maintenance and emergency repairs, our specialized services address the unique challenges of condo living. 
              Experience superior comfort, energy savings, and pristine air quality with our expert solutions.
            </p>
          </div>

          {/* Apple-Style Services Showcase */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 'clamp(2rem, 6vw, 4rem)',
            marginBottom: 'clamp(2rem, 6vw, 4rem)',
            padding: 'clamp(1rem, 4vw, 2rem) 0'
          }}>
            {serviceData.map((service, index) => (
              <div
                key={service.key}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(500px, 80vh, 90vh)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  scrollSnapAlign: 'start',
                  minHeight: 'clamp(500px, 70vh, 700px)',
                  borderRadius: 'clamp(12px, 3vw, 20px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }}
              >
                {/* Video Background */}
                {service.video ? (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                  }}>
                    <video
                      src={service.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                      poster="/logo.png"
                    />
                  </div>
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                    zIndex: 1
                  }} />
                )}

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(${index % 2 === 0 ? '90deg' : '270deg'}, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)`,
                  zIndex: 2
                }} />

                {/* Content Section */}
                <div style={{
                  position: 'relative',
                  zIndex: 3,
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1rem, 4vw, 2rem)',
                  color: '#fff',
                  background: 'transparent',
                  minHeight: 'clamp(400px, 60vh, 600px)',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  {/* Service Badge */}
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 2rem)',
                    borderRadius: '50px',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(1rem, 4vw, 2rem)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    {service.title}
                  </div>

                  {/* Main Headline */}
                  <h3 style={{ 
                    fontSize: 'clamp(1.5rem, 5vw, 3rem)', 
                    fontWeight: 800, 
                    color: '#fff',
                    margin: '0 0 clamp(0.5rem, 2vw, 1rem) 0',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                    maxWidth: '100%'
                  }}>
                    {service.subtitle}
                  </h3>

                  {/* Subtitle */}
                  <p style={{ 
                    fontSize: 'clamp(0.9rem, 3vw, 1.3rem)', 
                    color: '#fff', 
                    margin: '0 0 clamp(1rem, 4vw, 1.5rem) 0',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    textShadow: '0 2px 15px rgba(0,0,0,0.8)',
                    maxWidth: '100%'
                  }}>
                    {service.summary[0]}
                  </p>

                  {/* Key Features */}
                  <div style={{ marginBottom: 'clamp(1rem, 4vw, 1.5rem)' }}>
                    {service.summary.slice(1).map((feature, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                        fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                        color: '#fff',
                        fontWeight: 500,
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                        maxWidth: '100%',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: 'clamp(6px, 1.5vw, 8px)',
                          height: 'clamp(6px, 1.5vw, 8px)',
                          borderRadius: '50%',
                          background: '#fff',
                          marginRight: 'clamp(0.5rem, 2vw, 1rem)',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                        }} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link 
                    to={service.key === 'fan' ? '/fan-coil-service' : service.key === 'heat' ? '/heat-pump-service' : '/vent-cleaning-service'}
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.9)',
                      color: '#000',
                      padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      transition: 'all 0.3s ease',
                      gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      minHeight: 44
                    }}
                  >
                    Learn More
                    <FaArrowRight size={16} />
                  </Link>
                </div>

                {/* Icon Section (for non-video services) */}
                {!service.video && (
                  <div style={{
                    position: 'relative',
                    zIndex: 3,
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`
                  }}>
                    <div style={{
                      textAlign: 'center',
                      color: '#fff'
                    }}>
                      {service.icon}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Our Commitment Section */}
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            marginBottom: '4rem'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              color: 'var(--color-primary)',
              margin: '0 0 3rem 0'
            }}>
              Our Commitment to Condo Owners
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isTouchDevice() ? '1fr' : 'repeat(3, 1fr)',
              gap: '2rem',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  🏠
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  Local Expertise
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: 1.6
                }}>
                  Deep understanding of condo building systems, regulations, and the unique challenges of high-rise HVAC maintenance.
                </p>
              </div>

              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  ⚡
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  Reliable Service
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: 1.6
                }}>
                  Direct access to the owner, Sam. No call centers, no runaround—just real help when you need it most.
                </p>
              </div>

              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  💰
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  marginBottom: '1rem'
                }}>
                  Value & Savings
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: 1.6
                }}>
                  Energy-efficient solutions that reduce your utility bills while improving comfort and air quality in your condo.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem',
            background: 'linear-gradient(135deg, var(--color-primary), #1a365d)',
            borderRadius: '20px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'rotate(45deg)'
            }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 700, 
                margin: '0 0 1rem 0',
                color: '#fff'
              }}>
                Ready to Transform Your Condo's Comfort?
              </h3>
              <p style={{ 
                fontSize: '1.2rem', 
                color: 'rgba(255,255,255,0.9)', 
                margin: '0 0 2.5rem 0',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.6
              }}>
                Join over 500 satisfied condo owners who trust us with their HVAC needs. 
                Get a free consultation and discover how we can improve your comfort, air quality, and energy efficiency.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  to="/services" 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#fff',
                    color: 'var(--color-primary)',
                    padding: '1.25rem 2.5rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    gap: '0.75rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  View All Services
                  <FaArrowRight size={16} />
                </Link>
                <a 
                  href="tel:+14169979123"
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'var(--color-secondary)',
                    color: '#fff',
                    padding: '1.25rem 2.5rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    gap: '0.75rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  Call Now
                  <FaPhoneAlt size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
