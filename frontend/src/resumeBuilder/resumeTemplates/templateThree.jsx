import React, { forwardRef } from 'react';
import useResumeStore from '../../stateManage/useResumeStore';

const TemplateThree = forwardRef((props, ref) => {
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

  return (
    <div
      ref={ref}
      className="w-[794px] min-h-[1123px] flex"
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        color: '#000',
        boxSizing: 'border-box',
        overflowWrap: 'break-word',
        wordBreak: 'break-word'
      }}
    >
      {/* Sidebar */}
      <div
        className="w-[30%] bg-[#f2ecfa] p-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {profileInfo.profilePreviewUrl && (
          <img
            src={profileInfo.profilePreviewUrl}
            alt="Profile"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '12px',
              alignSelf: 'center'
            }}
          />
        )}

        {/* Contact */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            fontWeight: 'bold',
            borderBottom: '1px solid #c4b7e3',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            Contact
          </h3>
          <ul style={{ fontSize: '12px', lineHeight: '1.5' }}>
            {contactInfo.email && <li>📧 {contactInfo.email}</li>}
            {contactInfo.phone && <li>📞 {contactInfo.phone}</li>}
            {contactInfo.linkedin && <li>🔗 {contactInfo.linkedin}</li>}
            {contactInfo.location && <li>📍 {contactInfo.location}</li>}
            {contactInfo.github && <li>💻 {contactInfo.github}</li>}
            {contactInfo.website && <li>🌐 {contactInfo.website}</li>}
          </ul>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontWeight: 'bold',
              borderBottom: '1px solid #c4b7e3',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Skills
            </h3>
            <ul style={{
              fontSize: '12px',
              lineHeight: '1.5',
              listStyleType: 'disc',
              paddingLeft: '16px'
            }}>
              {skills.map((skill, i) => <li key={i}>{skill.name}</li>)}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontWeight: 'bold',
              borderBottom: '1px solid #c4b7e3',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Languages
            </h3>
            <ul style={{ fontSize: '12px', lineHeight: '1.5' }}>
              {languages.map((lang, i) => (
                <li key={i}>{lang.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interests */}
        {interest.length > 0 && (
          <div style={{
            marginBottom: '16px',
            pageBreakInside: 'avoid'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '8px',
              color: '#4338ca',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              Interests
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '12px',
              lineHeight: '1.5',
              color: '#4b5563'
            }}>
              {interest.map((item, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    padding: '2px 0',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    position: 'relative',
                    paddingRight: '8px'
                  }}
                >
                  {item.name}
                  {i < interest.length - 1 && (
                    <span style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#d1d5db'
                    }}>•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className="w-[70%] p-6"
        style={{
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#4338ca',
            marginBottom: '4px'
          }}>
            {profileInfo.fullName}
          </h1>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            {profileInfo.designation}
          </h2>
          {profileInfo.summary && (
            <p style={{
              fontSize: '12px',
              color: '#374151',
              textAlign: 'left'
            }}>
              {profileInfo.summary}
            </p>
          )}
        </div>

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ddd',
              marginBottom: '8px',
              paddingBottom: '2px'
            }}>
              Work Experience
            </h3>
            {workExperience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  {exp.role} at {exp.company}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  {exp.startDate} – {exp.endDate}
                </p>
                <p style={{ fontSize: '12px' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ddd',
              marginBottom: '8px',
              paddingBottom: '2px'
            }}>
              Education
            </h3>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  {edu.degree}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '2px'
                }}>
                  {edu.institution}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {edu.startDate} – {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ddd',
              marginBottom: '8px',
              paddingBottom: '2px'
            }}>
              Certifications
            </h3>
            <ul style={{
              fontSize: '12px',
              listStyleType: 'disc',
              paddingLeft: '16px'
            }}>
              {certifications.map((cert, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {cert.title}, {cert.issuer} ({cert.year})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ddd',
              marginBottom: '8px',
              paddingBottom: '2px'
            }}>
              Projects
            </h3>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {proj.title}
                </p>
                <p style={{
                  fontSize: '12px',
                  marginBottom: '4px'
                }}>
                  {proj.description}
                </p>
                {proj.github && (
                  <a
                    href={proj.github}
                    style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    GitHub
                  </a>
                )}
                {proj.liveDemo && (
                  <a
                    href={proj.liveDemo}
                    style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      display: 'block'
                    }}
                  >
                    Live Demo
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default TemplateThree;