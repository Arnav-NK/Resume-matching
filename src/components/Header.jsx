import { useEffect, useState } from 'react';

export default function Header({ onNewAnalysis, onToggleHistory }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header id="app-header" className={scrolled ? 'scrolled' : ''}>
        <div className="header-inner">
          <a href="#" className="logo" id="logo-link">
            <div className="logo-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="26" rx="2" stroke="url(#logoGrad)" strokeWidth="2" />
                <rect x="10" y="2" width="20" height="26" rx="2" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.5" />
                <line x1="6" y1="12" x2="18" y2="12" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="16" x2="16" y2="16" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="20" x2="14" y2="20" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="24" cy="22" r="6" fill="url(#logoGrad)" opacity="0.15" />
                <path d="M22 22l1.5 1.5L27 20" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#a78bfa" /><stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">ResumeForge<span className="logo-ai">AI</span></span>
          </a>

          <nav className="header-nav">
            <a href="#upload-section" className="nav-link">Upload</a>
            <a href="#jd-section" className="nav-link">Job Description</a>
            <a href="#results-section" className="nav-link">Results</a>
          </nav>

          <div className="header-actions">
            <button className="btn btn-ghost" onClick={onToggleHistory}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              History
            </button>
            <button className="btn btn-primary" onClick={onNewAnalysis}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              New Analysis
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-nav open">
          <a href="#upload-section" className="nav-link" onClick={() => setMobileOpen(false)}>Upload Resumes</a>
          <a href="#jd-section" className="nav-link" onClick={() => setMobileOpen(false)}>Job Description</a>
          <a href="#results-section" className="nav-link" onClick={() => setMobileOpen(false)}>Results</a>
        </div>
      )}
    </>
  );
}
