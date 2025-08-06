import React from 'react';
import { Link } from 'react-router-dom';
import { FaSnowflake, FaCheck, FaPhoneAlt, FaCalendarCheck, FaExclamationTriangle, FaArrowLeft, FaShieldAlt, FaTools, FaThermometerHalf, FaLeaf, FaDollarSign } from 'react-icons/fa';

function HeatPumpService() {
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
          <FaSnowflake size={24} style={{ marginRight: '1rem' }} />
          <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
            Heat Pump Systems
          </span>
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          margin: '0 0 1.5rem 0',
          lineHeight: 1.1,
          color: '#fff'
        }}>
          Year-Round Comfort & Energy Savings: Advanced Heat Pump Solutions for Condos
        </h1>

        <p style={{
          fontSize: '1.3rem',
          color: '#fff',
          maxWidth: '800px',
          margin: '0 auto 3rem auto',
          lineHeight: 1.6,
          opacity: 0.95
        }}>
          Embrace sustainable heating and cooling with our advanced heat pump systems. We specialize in installation, repair, and maintenance of air-source and ground-source heat pumps, tailored for Canadian climates to maximize efficiency and reduce your utility bills.
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

      {/* What is Heat Pump Section */}
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
            Understanding Heat Pump Technology
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
            Heat pumps are highly efficient systems that transfer heat between indoor and outdoor environments, providing both heating and cooling from a single unit. 
            They're particularly effective in Canadian climates and can reduce energy costs by up to 50% compared to traditional HVAC systems.
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
                <FaThermometerHalf size={18} style={{ marginRight: '0.5rem', color: '#ff9800' }} />
                Dual Function
              </h3>
              <p style={{ lineHeight: 1.5, color: '#666', fontSize: '0.95rem' }}>
                One system provides both heating and cooling, eliminating the need for separate units and reducing installation costs.
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
                <FaLeaf size={18} style={{ marginRight: '0.5rem', color: '#ff9800' }} />
                Energy Efficient
              </h3>
              <p style={{ lineHeight: 1.5, color: '#666', fontSize: '0.95rem' }}>
                Heat pumps can be 2-3 times more efficient than traditional heating systems, significantly reducing your carbon footprint.
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
                <FaDollarSign size={18} style={{ marginRight: '0.5rem', color: '#ff9800' }} />
                Cost Savings
              </h3>
              <p style={{ lineHeight: 1.5, color: '#666', fontSize: '0.95rem' }}>
                Lower energy consumption translates to significant savings on your utility bills while reducing your carbon footprint.
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
          Why You Need Professional Heat Pump Service
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
              Reduced Efficiency Over Time
            </h3>
            <p style={{ lineHeight: 1.6, color: '#666', marginBottom: '1rem' }}>
              Heat pumps lose efficiency due to wear, dirt buildup, and refrigerant issues, leading to higher energy costs.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Decreased heating/cooling capacity
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Higher energy consumption
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Inconsistent temperature control
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
              System Breakdowns
            </h3>
            <p style={{ lineHeight: 1.6, color: '#666', marginBottom: '1rem' }}>
              Neglected heat pumps are prone to compressor failures, refrigerant leaks, and electrical issues that require expensive repairs.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Compressor and motor failures
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Refrigerant leaks
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Electrical component failures
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
              Poor Performance
            </h3>
            <p style={{ lineHeight: 1.6, color: '#666', marginBottom: '1rem' }}>
              Inefficient heat pumps struggle to maintain comfortable temperatures, especially during extreme weather conditions.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Inconsistent temperatures
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Poor air circulation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#666' }}>
                <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                Reduced comfort levels
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
            Our Comprehensive Heat Pump Solutions
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
                Professional Installation
              </h3>
              <p style={{ lineHeight: 1.6, color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                Expert installation of energy-efficient heat pump systems, ensuring optimal performance and long-term reliability for your condo.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Proper system sizing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Professional installation
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  System testing and optimization
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
                Preventive Maintenance
              </h3>
              <p style={{ lineHeight: 1.6, color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                Regular maintenance to keep your heat pump running efficiently, including filter changes, coil cleaning, and performance optimization.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Filter replacement
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Coil cleaning
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Performance optimization
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
                Emergency Repairs
              </h3>
              <p style={{ lineHeight: 1.6, color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                Fast and reliable emergency repair services when your heat pump fails, minimizing discomfort and preventing further damage.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  24/7 emergency service
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Quick diagnosis and repair
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                  <FaCheck size={14} style={{ color: '#28a745', marginRight: '0.5rem' }} />
                  Quality replacement parts
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
          Ready to Save on Energy Costs?
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
          Don't let an inefficient heat pump cost you money. Contact us today for professional service that maximizes your comfort and savings.
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

export default HeatPumpService; 