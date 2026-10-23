


import React, { forwardRef } from 'react';
import useResumeStore from '../../stateManage/useResumeStore';

const LatexTemplate = forwardRef((props, ref) => {
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
    interests = []
  } = resumeData;

  const formatUrl = (url) => {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Month Year";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? "Month Year" 
        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
      return "Month Year";
    }
  };

  return (
    <div ref={ref} style={{
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      fontSize: '11px',
      width: '210mm',
      minHeight: '297mm',
      maxHeight: '297mm',
      padding: '15mm',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      color: '#000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Header */}
      <header style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexShrink: 0 }}>
        {profileInfo.profilePreviewUrl ? (
          <img
            src={profileInfo.profilePreviewUrl}
            alt="Profile"
            style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc' }}
          />
        ) : (
          <div style={{ width: '90px', height: '90px', backgroundColor: '#ccc', borderRadius: '50%', textAlign: 'center', fontSize: '11px', lineHeight: '90px' }}>
            No Image
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
            {profileInfo.fullName || "Your Name"}
          </h1>
          <h2 style={{ fontSize: '13px', marginBottom: '10px' }}>
            {profileInfo.institution || "Institution Name"}
          </h2>
          <div style={{ fontSize: '11px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {contactInfo.location && <span>📍 {contactInfo.location}</span>}
            <span>📱 {contactInfo.phone || "+91-XXXXXXXXXX"}</span>
            <span>✉ {contactInfo.email || "email@example.com"}</span>
            {contactInfo.github && (
              <span>🔗 <a href={formatUrl(contactInfo.github)} target="_blank" rel="noopener noreferrer">GitHub</a></span>
            )}
            {contactInfo.linkedin && (
              <span>🔗 <a href={formatUrl(contactInfo.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div style={{ overflowY: 'auto', flex: 1 }}>

        {[
          {
            title: 'Education',
            data: education,
            render: (edu, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <strong style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                  {edu.institution || "Institution Name"}
                </strong>
                <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </div>
                <div style={{ fontSize: '11px' }}>
                  {edu.degree || "Degree Name"} | CGPA: {edu.cgpa || '-'} | {edu.percentage ? `${edu.percentage}%` : '-'}
                </div>
              </div>
            )
          },
          {
            title: 'Projects',
            data: projects,
            render: (proj, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '12px' }}>
                    {proj.title || "Project Title"}
                  </strong>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.github && (
                      <a
                        href={formatUrl(proj.github)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '11px',
                          color: '#0056b3',
                          fontWeight: 'bold',
                          textDecoration: 'underline'
                        }}
                      >
                        GitHub
                      </a>
                    )}
                    {proj.liveDemo && (
                      <a
                        href={formatUrl(proj.liveDemo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '11px',
                          color: '#d9534f',
                          fontWeight: 'bold',
                          textDecoration: 'underline'
                        }}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '11px', marginTop: '5px' }}>
                  {proj.description}
                </div>
              </div>
            )
          },
          {
            title: 'Work Experience',
            data: workExperience,
            render: (exp, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <strong style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                  {exp.role || "Role"} @ {exp.company || "Company"}
                </strong>
                <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                </div>
                <div style={{ fontSize: '11px' }}>
                  {exp.description}
                </div>
              </div>
            )
          },
          { title: 'Certifications', data: certifications, render: (cert, i) => (
  <div key={i} style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong style={{ fontSize: '12px' }}>
        {cert.title || "Certificate Title"}
      </strong>
      <span style={{ fontSize: '11px', color: '#666', marginLeft: '15px' }}>
        {cert.year ? new Date(cert.year).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ""}
      </span>
    </div>

    {/* Issuer (below title) */}
    {cert.issuer && (
      <div style={{ fontSize: '11px', color: '#444', marginTop: '3px' }}>
        Issued by {cert.issuer}
      </div>
    )}

    {/* Link (highlighted) */}
    {cert.link && (
      <div style={{ marginTop: '5px' }}>
        <a 
          href={formatUrl(cert.link)} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            fontSize: '11px', 
            color: '#ff6900', 
            textDecoration: 'underline',
            fontWeight: '500'
          }}
        >
          View Certificate
        </a>
      </div>
    )}
  </div>
)},

        ].map(section => (
          <section key={section.title} style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px',
              borderBottom: '1px solid #000',
              paddingBottom: '4px'
            }}>
              {section.title}
            </h3>

            {section.data.length ? section.data.map(section.render) : (
              <p style={{ fontSize: '11px', marginBottom: '10px' }}>
                No {section.title.toLowerCase()} data added.
              </p>
            )}
          </section>
        ))}

      </div>

    </div>
  );
});

export default LatexTemplate;

