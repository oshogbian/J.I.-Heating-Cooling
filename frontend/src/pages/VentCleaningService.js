import React from 'react';
import { Link } from 'react-router-dom';
import { FaWind, FaCheck, FaPhoneAlt, FaCalendarCheck, FaExclamationTriangle, FaArrowLeft, FaShieldAlt, FaTools, FaFire, FaLungs, FaHome } from 'react-icons/fa';

function VentCleaningService() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fff',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{
        background: '#183153',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: 600,
          gap: '0.5rem',
          transition: 'opacity 0.2s'
        }}>
          <FaArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #183153 0%, #1a365d 100%)',
        padding: '3rem 2rem 2rem 2rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        color: '#fff'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.2)',
          padding: '1rem 2rem',
          borderRadius: '50px',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <FaWind size={24} style={{ marginRight: '1rem' }} />
          <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
            Vent Cleaning
          </span>
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          margin: '0 0 1.5rem 0',
          lineHeight: 1.1,
          color: '#fff'
        }}>
          Breathe Cleaner, Live Healthier: Professional Vent Cleaning for Condos
        </h1>

        <p style={{
          fontSize: '1.3rem',
          color: '#fff',
          maxWidth: '800px',
          margin: '0 auto 3rem auto',
          lineHeight: 1.6,
          opacity: 0.95
        }}>
          Eliminate dust, allergens, and contaminants from your condo's ventilation system. Our comprehensive vent cleaning services improve indoor air quality, enhance HVAC efficiency, and contribute to a healthier living environment.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '4rem'
        }}>
          <a href="tel:+14169979123" style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#ff9800',
            color: '#fff',
            padding: '1rem 2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <FaPhoneAlt size={16} />
            Call Now
          </a>
          <Link to="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '1rem 2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            gap: '0.5rem',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <FaCalendarCheck size={16} />
            Schedule Service
          </Link>
        </div>
      </div>

      {/* Understanding Vent Cleaning Section */}
      <div style={{
        background: '#f8f9fa',
        padding: '2.5rem 2rem',
        margin: '1rem 0',
        color: '#333'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            margin: '0 0 1.5rem 0',
            textAlign: 'center',
            color: '#183153'
          }}>
            Understanding Vent Cleaning & Air Quality
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: 1.6, 
            marginBottom: '1.5rem', 
            color: '#666',
            textAlign: 'center',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Your condo's ventilation system circulates air throughout your living space. Over time, dust, allergens, and debris accumulate in ducts and vents, 
            compromising air quality and system efficiency. Professional cleaning removes these contaminants for healthier indoor air.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.75rem 0', color: '#183153' }}>
                <FaHome size={18} style={{ marginRight: '0.5rem', color: '#ff9800' }} />
                Air Duct Cleaning
              </h3>
              <p style={{ lineHeight: 1.5, color: '#666', fontSize: '0.95rem' }}>
                Remove dust, debris, and allergens from your HVAC ductwork to improve air quality and system efficiency.
              </p>
            </div>

            <div style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.75rem 0', color: '#183153' }}>
                <FaFire size={18} style={{ marginRight: '0.5rem', color: '#ff9800' }} />
                Dryer Vent Cleaning
              </h3>
              <p style={{ lineHeight: 1.5, color: '#666', fontSize: '0.95rem' }}>
                Prevent fire hazards and improve dryer efficiency by removing lint buildup from dryer vents.
              </p>
            </div>

            <div style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.75rem 0', color: '#183153' }}>
                <FaLungs size={18} style={{ marginRight: '0.5rem', color: '#ff9800' }} />
                Air Quality Testing
              </h3>
              <p style={{ lineHeight: 1.5, color: '#666', fontSize: '0.95rem' }}>
                Assess indoor air quality and identify contaminants that may be affecting your health and comfort.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why You Need Our Service */}
      <div style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#fff'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          margin: '0 0 3rem 0',
          textAlign: 'center',
          color: '#183153'
        }}>
          Why You Need Professional Vent Cleaning
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '15px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#dc3545' }}>
              <FaExclamationTriangle size={20} style={{ marginRight: '0.5rem' }} />
              Fire Safety Hazard
            </h3>
            <p style={{ lineHeight: 1.6, color: '#666', marginBottom: '1rem' }}>
              Clogged dryer vents are a leading cause of house fires. Lint buildup creates a dangerous fire hazard that can be prevented.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Lint buildup in dryer vents
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Increased fire risk
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Reduced dryer efficiency
              </li>
            </ul>
          </div>

          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '15px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#dc3545' }}>
              <FaExclamationTriangle size={20} style={{ marginRight: '0.5rem' }} />
              Poor Air Quality
            </h3>
            <p style={{ lineHeight: 1.6, color: '#666', marginBottom: '1rem' }}>
              Dirty air ducts circulate dust, allergens, and contaminants throughout your home, affecting your health and comfort.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Allergen and dust circulation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Respiratory health issues
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Reduced system efficiency
              </li>
            </ul>
          </div>

          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '15px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#dc3545' }}>
              <FaExclamationTriangle size={20} style={{ marginRight: '0.5rem' }} />
              System Performance Issues
            </h3>
            <p style={{ lineHeight: 1.6, color: '#666', marginBottom: '1rem' }}>
              Clogged vents reduce airflow, forcing your HVAC system to work harder and consume more energy.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Reduced airflow
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Higher energy consumption
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                System wear and tear
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Our Services */}
      <div style={{
        background: '#183153',
        padding: '2.5rem 2rem',
        margin: '1rem 0',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            margin: '0 0 2rem 0',
            textAlign: 'center',
            color: '#fff'
          }}>
            Our Professional Vent Cleaning Services
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <FaTools size={48} style={{ marginBottom: '1rem', color: '#28a745' }} />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#fff' }}>
                Air Duct Cleaning
              </h3>
              <p style={{ lineHeight: 1.6, color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                Comprehensive cleaning of your HVAC ductwork to remove dust, debris, and allergens for improved air quality.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Complete duct system cleaning
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Allergen removal
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Improved air circulation
                </li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <FaShieldAlt size={48} style={{ marginBottom: '1rem', color: '#28a745' }} />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#fff' }}>
                Dryer Vent Cleaning
              </h3>
              <p style={{ lineHeight: 1.6, color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                Professional dryer vent cleaning to prevent fire hazards and improve dryer efficiency and lifespan.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Lint removal and prevention
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Fire safety improvement
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Enhanced dryer performance
                </li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <FaExclamationTriangle size={48} style={{ marginBottom: '1rem', color: '#dc3545' }} />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#fff' }}>
                Health & Safety Benefits
              </h3>
              <p style={{ lineHeight: 1.6, color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                Improved indoor air quality and fire safety for a healthier, safer home environment.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Allergen reduction
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Fire hazard prevention
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Better air circulation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #183153 0%, #1a365d 100%)',
        color: '#fff'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          margin: '0 0 1.5rem 0',
          color: '#fff'
        }}>
          Ready for Cleaner, Safer Air?
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: '#fff',
          margin: '0 0 2rem 0',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0.95
        }}>
          Don't compromise your family's health and safety. Contact us today for professional vent cleaning that protects your home and improves air quality.
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="tel:+14169979123" style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#ff9800',
            color: '#fff',
            padding: '1.25rem 2.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.2rem',
            gap: '0.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <FaPhoneAlt size={18} />
            Call Now: +1 416 997 9123
          </a>
          <Link to="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '1.25rem 2.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.2rem',
            gap: '0.75rem',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <FaCalendarCheck size={18} />
            Schedule Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VentCleaningService; 