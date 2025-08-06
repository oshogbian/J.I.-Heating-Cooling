import React from 'react';
import { FaFan, FaSnowflake, FaWind, FaPhoneAlt, FaCheck, FaShieldAlt, FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

function About() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a365d 100%)',
        padding: '5rem 0',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 700, 
            margin: '0 0 1rem 0',
            color: 'var(--color-secondary)'
          }}>
            Your Trusted Partner for Condo HVAC
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Founded in the heart of Toronto, J.I. Heating & Cooling was born from a deep understanding of the unique HVAC challenges faced by condo owners. 
            We saw a need for specialized, reliable, and transparent service, and set out to build a company dedicated to ensuring optimal comfort and air quality for every urban home.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          
          {/* Service Expertise */}
          <div style={{ marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              color: '#183153 !important',
              textAlign: 'center',
              margin: '0 0 3rem 0'
            }}>
              Our Mission & Expertise
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#333333 !important',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto 3rem auto',
              lineHeight: 1.6
            }}>
              Our mission is to deliver unparalleled HVAC solutions to Toronto's condo community, built on a foundation of trust, expertise, and a commitment to your well-being. 
              We specialize in the unique challenges of high-rise living and multi-unit HVAC systems.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '2rem'
            }}>
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                textAlign: 'center'
              }}>
                <FaFan style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#183153 !important', margin: '0 0 1rem 0' }}>
                  Fan Coil Systems
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', lineHeight: 1.6, margin: 0 }}>
                  Specialized in condo fan coil unit installation, maintenance, and repair. 
                  We understand the unique challenges of high-rise HVAC systems.
                </p>
              </div>
              
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                textAlign: 'center'
              }}>
                <FaSnowflake style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#183153 !important', margin: '0 0 1rem 0' }}>
                  Heat Pump Technology
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', lineHeight: 1.6, margin: 0 }}>
                  High-efficiency heat pump installation and maintenance. 
                  Energy-saving solutions that reduce costs and environmental impact.
                </p>
              </div>
              
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                textAlign: 'center'
              }}>
                <FaWind style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#183153 !important', margin: '0 0 1rem 0' }}>
                  Ventilation & Air Quality
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', lineHeight: 1.6, margin: 0 }}>
                  Professional vent cleaning and air quality services. 
                  Improve indoor air quality and prevent fire hazards.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div style={{ marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              color: '#183153 !important',
              textAlign: 'center',
              margin: '0 0 3rem 0'
            }}>
              Why Choose J.I. Heating & Cooling?
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem'
            }}>
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
              }}>
                <FaShieldAlt style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#183153 !important', margin: '0 0 1rem 0' }}>
                  Licensed & Insured
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', lineHeight: 1.6, margin: 0 }}>
                  Fully licensed and insured HVAC professionals. Your safety and satisfaction are our top priorities.
                </p>
              </div>
              
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
              }}>
                <FaClock style={{ fontSize: '2rem', color: 'var(--color-secondary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ff9800 !important', margin: '0 0 1rem 0' }}>
                  Prompt Service
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', lineHeight: 1.6, margin: 0 }}>
                  Quick response times and flexible scheduling. We understand that HVAC issues can't wait.
                </p>
              </div>
              
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
              }}>
                <FaUsers style={{ fontSize: '2rem', color: '#00bcd4', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#00bcd4 !important', margin: '0 0 1rem 0' }}>
                  Direct Owner Access
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', lineHeight: 1.6, margin: 0 }}>
                  Speak directly with Sam, the owner. No call centers, no runaround—just real help when you need it.
                </p>
              </div>
            </div>
          </div>

          {/* Service Process */}
          <div style={{ marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              color: '#183153 !important',
              textAlign: 'center',
              margin: '0 0 3rem 0'
            }}>
              Our Service Process
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#183153 !important', margin: '0 0 0.5rem 0' }}>
                  Contact Us
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', margin: 0 }}>
                  Call or message us to discuss your HVAC needs
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'var(--color-secondary)',
                  color: '#fff',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff9800 !important', margin: '0 0 0.5rem 0' }}>
                  Assessment
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', margin: 0 }}>
                  We evaluate your system and provide a detailed quote
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#00bcd4',
                  color: '#fff',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#00bcd4 !important', margin: '0 0 0.5rem 0' }}>
                  Professional Service
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', margin: 0 }}>
                  Our expert team completes the work efficiently
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#28a745',
                  color: '#fff',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  4
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#28a745 !important', margin: '0 0 0.5rem 0' }}>
                  Quality Assurance
                </h3>
                <p style={{ fontSize: '1rem', color: '#333333 !important', margin: 0 }}>
                  We ensure everything works perfectly before leaving
                </p>
              </div>
            </div>
          </div>

          {/* Service Area */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: '3rem',
            borderRadius: '15px',
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <FaMapMarkerAlt style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
            <h3 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 700, 
              color: '#183153 !important',
              margin: '0 0 1rem 0'
            }}>
              Serving the Greater Toronto Area (GTA)
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#333333 !important', 
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              From downtown condos to Mississauga homes, we provide comprehensive HVAC services 
              throughout the entire Greater Toronto Area. No job is too big or too small.
            </p>
          </div>

          {/* Call to Action */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), #1a365d)',
            padding: '3rem',
            borderRadius: '15px',
            textAlign: 'center',
            color: '#fff'
          }}>
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: 700, 
              margin: '0 0 1rem 0',
              color: '#fff'
            }}>
              Ready for Professional HVAC Service?
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)', 
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Contact us today for reliable, professional HVAC services you can trust.
            </p>
            <a 
              href="tel:+14169979123"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--color-secondary)',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                gap: '0.5rem'
              }}
            >
              <FaPhoneAlt />
              Call Sam Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
