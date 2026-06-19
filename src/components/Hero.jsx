import { useApp } from '../context/AppContext';

export default function Hero() {
  const { state } = useApp();
  const resumeCount = state.resumes.filter((r) => r && r.parsed).length;

  return (
    <section className="hero" id="hero-section">
      <div className="hero-badge">
        <span className="badge-dot" />
        AI-Powered Resume Strategy
      </div>
      <h1 className="hero-title">
        Tailor Your Resume<br />
        <span className="gradient-text">With Surgical Precision</span>
      </h1>
      <p className="hero-subtitle">
        Upload your master resumes, paste any job description, and get{' '}
        <strong>exact, copy-paste-ready changes</strong> — ATS-optimized, truthful,
        and strategically aligned to your real experience.
      </p>
      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number">{resumeCount}</span>
          <span className="stat-label">Resumes Loaded</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number">{state.totalAnalyses}</span>
          <span className="stat-label">Analyses Run</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number">{state.totalKeywords}</span>
          <span className="stat-label">Keywords Matched</span>
        </div>
      </div>
      <a href="#upload-section" className="btn btn-hero">
        Get Started
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </a>
    </section>
  );
}
