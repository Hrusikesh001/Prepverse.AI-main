

import React, { forwardRef } from 'react';
import useResumeStore from '../../stateManage/useResumeStore';
import RatingInput from '../ratingInput';

const TemplateFour = forwardRef((props, ref) => {
  const { resumeData } = useResumeStore();
  const {
    profileInfo = {},
    contactInfo = {},
    workExperience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interest = []
  } = resumeData;

  const colors = {
    primary: '#4338ca',
    secondary: '#6b7280',
    accent: '#10b981',
    background: '#f9fafb',
    text: '#111827',
    heading: '#1e40af'
  };

  // Adjust scale if content is too long
  const contentLength = JSON.stringify(resumeData).length;
  let scale = 1;
  if (contentLength > 2500) scale = 0.95;
  if (contentLength > 4000) scale = 0.9;
  if (contentLength > 6000) scale = 0.85;

  return (
    <div
      ref={ref}
      style={{
        width: '794px', // A4 width
        minHeight: '1123px', // A4 height
        margin: '0 auto',
        transform: `scale(${scale})`,
        transformOrigin: 'top center', // center scaling
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: colors.text,
        backgroundColor: '#fff',
        overflow: 'hidden', // prevent horizontal scroll
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Full-width Header */}
      <div style={{
        width: '100%',
        backgroundColor: colors.primary,
        color: 'white',
        padding: '24px 0',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '1px' }}>
          {profileInfo.fullName || 'Your Name'}
        </h1>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', opacity: 0.9 }}>
          {profileInfo.designation || 'Your Professional Title'}
        </h2>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: '16px',
        gap: '16px',
        boxSizing: 'border-box',
        margin: 0,
        overflow: 'hidden'
      }}>
        {/* Left Sidebar */}
        <div style={{
          flex: '0 0 30%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.background,
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          {profileInfo.profilePreviewUrl && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <img
                src={profileInfo.profilePreviewUrl}
                alt="Profile"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${colors.primary}` }}
              />
            </div>
          )}

          {/* Contact */}
          {contactInfo && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '4px', marginBottom: '8px' }}>Contact</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: 1.3 }}>
                {contactInfo.email && <li>✉️ {contactInfo.email}</li>}
                {contactInfo.phone && <li>📱 {contactInfo.phone}</li>}
                {contactInfo.location && <li>📍 {contactInfo.location}</li>}
                {contactInfo.linkedin && <li>🔗 {contactInfo.linkedin}</li>}
                {contactInfo.github && <li>💻 {contactInfo.github}</li>}
              </ul>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '4px', marginBottom: '6px' }}>Skills</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: 1.3 }}>
                {skills.map((skill, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span>{skill.name || 'Unnamed Skill'}</span>
                    <RatingInput 
                      value={skill.progress || 0} 
                      onChange={() => { }} 
                      total={5} 
                      color={colors.primary} 
                      bgColor="#e5e7eb" 
                      readOnly 
                      size={12} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '4px', marginBottom: '6px' }}>Languages</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: 1.3 }}>
                {languages.map((lang, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span>{lang.name || 'Unnamed Language'}</span>
                    <RatingInput 
                      value={lang.progress || 0} 
                      onChange={() => { }} 
                      total={5} 
                      color={colors.accent} 
                      bgColor="#e5e7eb" 
                      readOnly 
                      size={12} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {interest.length > 0 && (
            <div>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '4px', marginBottom: '6px' }}>Interests</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {interest.map((item, i) => (
                  <span key={i} style={{ backgroundColor: colors.primary, color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '11px' }}>{item.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Professional Summary */}
          {profileInfo.summary && (
            <div>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px', marginBottom: '4px' }}>Professional Summary</h3>
              <p style={{ fontSize: '12px', lineHeight: 1.3, textAlign: 'justify' }}>{profileInfo.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px', marginBottom: '4px' }}>Work Experience</h3>
              {workExperience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: colors.primary }}>{exp.role} • {exp.company}</span>
                    <span style={{ fontSize: '12px', color: colors.secondary, fontStyle: 'italic' }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul style={{ paddingLeft: '16px', listStyle: 'disc', lineHeight: 1.3, fontSize: '12px' }}>
                    {exp.description.split('\n').map((d, idx) => d.trim() && <li key={idx}>{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px', marginBottom: '4px' }}>Education</h3>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px', color: colors.primary }}>{edu.degree}</p>
                  <p style={{ fontSize: '12px', fontWeight: '500' }}>{edu.institution}</p>
                  <p style={{ fontSize: '12px', color: colors.secondary, fontStyle: 'italic' }}>{edu.startDate} – {edu.endDate}</p>
                  {edu.specialization && <p style={{ fontSize: '12px' }}><strong>Specialization:</strong> {edu.specialization}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px', marginBottom: '4px' }}>Projects</h3>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px', color: colors.primary }}>{proj.title}</p>
                  <p style={{ fontSize: '12px', lineHeight: 1.3 }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                    {proj.github && <a href={proj.github} style={{ color: colors.primary }}>🔗 GitHub</a>}
                    {proj.liveDemo && <a href={proj.liveDemo} style={{ color: colors.primary }}>🌐 Live Demo</a>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h3 style={{ color: colors.heading, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '2px', marginBottom: '4px' }}>Certifications</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', lineHeight: 1.3 }}>
                {certifications.map((cert, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <p style={{ fontWeight: '500' }}>{cert.title}</p>
                    <p style={{ fontSize: '12px', color: colors.secondary }}>{cert.issuer} • {cert.year}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TemplateFour;