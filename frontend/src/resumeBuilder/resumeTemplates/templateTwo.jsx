

import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import useResumeStore from '../../stateManage/useResumeStore';

const MIN_SCALE = 0.55; // Minimum scale to fit content
const BASE_FONT_SIZE_PX = 13;
const BASE_LINE_HEIGHT = 1.6;

const TemplateTwo = forwardRef((props, ref) => {
  const { resumeData = {} } = useResumeStore();
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

  const pageRef = useRef(null);       // outer container
  const contentRef = useRef(null);    // content inside for scaling
  const [scale, setScale] = useState(1);

  // attach forwarded ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') ref(pageRef.current);
      else ref.current = pageRef.current;
    }
  }, [ref]);

  const formatUrl = (url) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Month Year";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Month Year";
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return "Month Year";
    }
  };

  const groupedSkills = {
    programming: skills.filter(s => s.category === 'programming'),
    frameworks: skills.filter(s => s.category === 'frameworks'),
    databases: skills.filter(s => s.category === 'databases'),
    others: skills.filter(s => s.category === 'others'),
  };

  // Measure the unscaled height
  const measureUnscaledHeight = () => {
    const content = contentRef.current;
    if (!content) return 1;

    const clone = content.cloneNode(true);
    const widthPx = Math.max(1, Math.round(content.getBoundingClientRect().width)) + 'px';
    clone.style.width = widthPx;
    clone.style.boxSizing = 'border-box';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.visibility = 'hidden';
    clone.style.transform = 'none';
    clone.style.pointerEvents = 'none';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';

    document.body.appendChild(clone);
    const measured = clone.scrollHeight || clone.getBoundingClientRect().height || 1;
    document.body.removeChild(clone);
    return Math.max(1, measured);
  };

  // Fit-to-page scaling (both width & height)
  const fitToPage = () => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    const pageWidth = page.clientWidth || page.getBoundingClientRect().width || 1;
    const pageHeight = page.clientHeight || page.getBoundingClientRect().height || 1;

    const contentWidth = content.scrollWidth || content.getBoundingClientRect().width || 1;
    const contentHeight = measureUnscaledHeight();

    const scaleWidth = pageWidth / contentWidth;
    const scaleHeight = pageHeight / contentHeight;

    const rawScale = Math.min(scaleWidth, scaleHeight);
    const clamped = Math.min(1, Math.max(MIN_SCALE, rawScale));

    setScale(prev => (Math.abs(prev - clamped) < 0.001 ? prev : clamped));
  };

  useLayoutEffect(() => {
    fitToPage();

    const content = contentRef.current;
    if (!content) return;

    const ro = new ResizeObserver(() => requestAnimationFrame(fitToPage));
    ro.observe(content);

    const onResize = () => requestAnimationFrame(fitToPage);
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [resumeData]);

  return (
    <div
      ref={pageRef}
      style={{
        width: '210mm',
        height: '297mm',
        padding: '18mm',
        boxSizing: 'border-box',
        background: '#fff',
        overflow: 'hidden',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        ref={contentRef}
        style={{
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          width: '100%',
          display: 'block',
          fontSize: `${BASE_FONT_SIZE_PX}px`,
          lineHeight: BASE_LINE_HEIGHT,
          color: '#000',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '12px', paddingBottom: '6px', borderBottom: '2px solid #000' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {profileInfo.fullName || 'Your Name'}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#444', marginTop: '8px' }}>
            <span>✉ {contactInfo.email || 'your.email@example.com'}</span>
            <span>📱 {contactInfo.phone || '(123) 456-7890'}</span>
            <span>📍 {contactInfo.location || 'City, State'}</span>
            <span>🔗 <a href={formatUrl(contactInfo.linkedin)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000' }}>{contactInfo.linkedin || 'linkedin.com/in/yourprofile'}</a></span>
            <span>🔗 <a href={formatUrl(contactInfo.github)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000' }}>{contactInfo.github || 'github.com/yourusername'}</a></span>
          </div>
        </header>

        {/* Professional Summary */}
        <section style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>Professional Summary</h2>
          <p style={{ color: '#333', margin: 0 }}>
            {profileInfo.summary || 'Experienced professional with expertise in ...'}
          </p>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>Technical Skills</h2>
          {skills.length > 0 ? (
            <div style={{ fontSize: '13px', color: '#333' }}>
              {groupedSkills.programming.length > 0 && <p style={{ margin: '4px 0' }}><strong>Programming:</strong> {groupedSkills.programming.map(s => s.name).join(', ')}</p>}
              {groupedSkills.frameworks.length > 0 && <p style={{ margin: '4px 0' }}><strong>Frameworks:</strong> {groupedSkills.frameworks.map(s => s.name).join(', ')}</p>}
              {groupedSkills.databases.length > 0 && <p style={{ margin: '4px 0' }}><strong>Databases:</strong> {groupedSkills.databases.map(s => s.name).join(', ')}</p>}
              {groupedSkills.others.length > 0 && <p style={{ margin: '4px 0' }}><strong>Others:</strong> {groupedSkills.others.map(s => s.name).join(', ')}</p>}
            </div>
          ) : <p>No technical skills added yet.</p>}
        </section>

        {/* Work Experience */}
        <section style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>Work Experience</h2>
          {workExperience.length > 0 ? workExperience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{exp.role || 'Role'}</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 6px 0', fontStyle: 'italic' }}>
                {exp.company || 'Company'} {exp.location ? `| ${exp.location}` : ''} | {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              <ul style={{ paddingLeft: '20px', color: '#333', fontSize: '13px', margin: 0 }}>
                {(exp.description || '').split('\n').map((line, i) => line.trim() ? <li key={i} style={{ marginBottom: '4px' }}>{line}</li> : null)}
              </ul>
            </div>
          )) : <p>No work experience added yet.</p>}
        </section>

        {/* Education */}
        <section style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>Education</h2>
          {education.length > 0 ? education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{edu.degree || 'Degree'}</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 6px 0', fontStyle: 'italic' }}>
                {edu.institution || 'Institution'} | {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </p>
              <p style={{ fontSize: '13px', color: '#333', margin: 0 }}>
                {edu.cgpa ? `CGPA: ${edu.cgpa}` : ''} {edu.specialization ? `| Specialization: ${edu.specialization}` : ''}
              </p>
            </div>
          )) : <p>No education details added yet.</p>}
        </section>

        {/* Projects */}
        <section style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>Projects</h2>
          {projects.length > 0 ? projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{proj.title || 'Project Title'}</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 6px 0', fontStyle: 'italic' }}>{proj.technologies || ''}</p>
              <p style={{ fontSize: '13px', color: '#333', margin: '0 0 6px 0' }}>{proj.description || ''}</p>
              {proj.github && <a href={formatUrl(proj.github)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0066cc' }}>GitHub</a>}
            </div>
          )) : <p>No projects added yet.</p>}
        </section>

        {/* Certifications */}
        <section style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>Certifications</h2>
          {certifications.length > 0 ? certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{cert.title || 'Certification'}</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 6px 0', fontStyle: 'italic' }}>
                {cert.issuer || ''} | {formatDate(cert.year)}
                {cert.link && <span>| <a href={formatUrl(cert.link)} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6900' }}>View Certificate</a></span>}
              </p>
            </div>
          )) : <p>No certifications added yet.</p>}
        </section>


      </div>
    </div>
  );
});

export default TemplateTwo;
