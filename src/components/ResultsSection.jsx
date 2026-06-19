import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ===== Copy helper =====
function CopyBtn({ textRef }) {
  const handleCopy = () => {
    const text = textRef.current?.innerText || '';
    navigator.clipboard.writeText(text);
  };
  return (
    <button className="btn btn-ghost btn-sm btn-copy" onClick={handleCopy}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      Copy
    </button>
  );
}

// ===== Card wrapper =====
function ResultCard({ icon, iconColor, title, children, copyable = true, delay = '0s' }) {
  const bodyRef = useRef(null);
  return (
    <div className="result-card" style={{ animationDelay: delay }}>
      <div className="result-card-header">
        <div className="result-card-title">
          <div className={`card-icon ${iconColor}`}>{icon}</div>
          {title}
        </div>
        {copyable && <CopyBtn textRef={bodyRef} />}
      </div>
      <div className="result-card-body" ref={bodyRef}>{children}</div>
    </div>
  );
}

// ===== 1. Best Resume Card =====
function BestResumeCard({ r }) {
  return (
    <ResultCard
      title="Best Resume to Modify"
      iconColor="purple"
      delay="0.05s"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
    >
      <div className="best-resume-info">
        <div className="best-resume-file">
          <p className="file-label">Selected File</p>
          <p className="file-value">{r.bestResume}</p>
        </div>
        <span className={`confidence-badge ${r.confidence.toLowerCase()}`}>{r.confidence} Match</span>
      </div>
      <p className="why-reason"><strong>Why this resume:</strong> {r.whyReason}</p>
    </ResultCard>
  );
}

// ===== 2. Score Card =====
function ScoreCard({ r }) {
  const gaugeRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (gaugeRef.current) {
        const offset = 226 - (226 * r.score) / 100;
        gaugeRef.current.style.strokeDashoffset = offset;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [r.score]);

  return (
    <ResultCard
      title="ATS Match Score"
      iconColor="cyan"
      copyable={false}
      delay="0.1s"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
    >
      <div className="score-gauge">
        <div className="gauge-circle">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="gaugeGradR" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" /><stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle className="gauge-bg" cx="40" cy="40" r="36" />
            <circle className="gauge-fill" cx="40" cy="40" r="36" ref={gaugeRef} stroke="url(#gaugeGradR)" />
          </svg>
          <span className="gauge-text">{r.score}%</span>
        </div>
        <div className="gauge-label">
          <strong>{r.strongMatches.length}</strong> of <strong>{r.strongMatches.length + r.weakMatches.length}</strong> JD keywords matched.{' '}
          {r.score >= 65
            ? 'Great alignment!'
            : r.score >= 40
              ? 'Decent match — changes below will improve it significantly.'
              : 'Significant gaps detected — apply all changes below.'}
        </div>
      </div>
    </ResultCard>
  );
}

// ===== 3. Job Analysis Card =====
function JobAnalysisCard({ r }) {
  const ri = r.roleInfo;
  return (
    <ResultCard
      title="Job Analysis"
      iconColor="blue"
      delay="0.15s"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>}
    >
      <div className="analysis-grid">
        <div className="analysis-item">
          <p className="analysis-item-label">Role</p>
          <p className="analysis-item-value">{ri.role}</p>
        </div>
        <div className="analysis-item">
          <p className="analysis-item-label">Seniority</p>
          <p className="analysis-item-value">{ri.seniority}</p>
        </div>
        <div className="analysis-item">
          <p className="analysis-item-label">Industry</p>
          <p className="analysis-item-value">{ri.industry}</p>
        </div>
        <div className="analysis-item">
          <p className="analysis-item-label">Match Confidence</p>
          <p className="analysis-item-value">{r.confidence}</p>
        </div>
        <div className="analysis-item full-width">
          <p className="analysis-item-label">Hidden Recruiter Keywords</p>
          <div className="keyword-tags" style={{ marginTop: 6 }}>
            {r.hiddenKeywords.length > 0
              ? r.hiddenKeywords.map((kw, i) => <span className="keyword-tag" key={i}>{kw}</span>)
              : <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>None detected</span>
            }
          </div>
        </div>
      </div>
    </ResultCard>
  );
}

// ===== 4. ATS Gap Analysis =====
function GapAnalysisCard({ r }) {
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <ResultCard
      title="ATS Gap Analysis"
      iconColor="green"
      delay="0.2s"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
    >
      <div className="gap-section">
        <div className="gap-section-title"><span className="dot green" /> Strong Matches ({r.strongMatches.length})</div>
        <div className="keyword-tags">
          {r.strongMatches.length > 0
            ? r.strongMatches.map((kw, i) => <span className="keyword-tag matched" key={i}>{cap(kw)}</span>)
            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No strong matches found</span>
          }
        </div>
      </div>
      <div className="gap-section" style={{ marginTop: 20 }}>
        <div className="gap-section-title"><span className="dot red" /> Weak / Missing ({r.weakMatches.length})</div>
        <div className="keyword-tags">
          {r.weakMatches.length > 0
            ? r.weakMatches.map((kw, i) => <span className="keyword-tag missing" key={i}>{cap(kw)}</span>)
            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No gaps detected — excellent!</span>
          }
        </div>
      </div>
    </ResultCard>
  );
}

// ===== 5. Exact Manual Changes =====
function ChangesCard({ r }) {
  return (
    <ResultCard
      title="Exact Manual Changes"
      iconColor="amber"
      delay="0.25s"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
    >
      {r.changes.map((change, i) => (
        <div className="change-item" key={i}>
          <div className="change-number">{i + 1}</div>
          <div className="change-header">
            <span className="change-section-name">
              {change.section}
              {change.company ? ` — ${change.company}` : ''}
            </span>
            <span className={`change-action ${change.action.toLowerCase()}`}>{change.action}</span>
          </div>
          {change.details.map((d, j) => (
            <div className="change-detail" key={j}>
              <p className="change-detail-label">{d.label}</p>
              <div className={`change-detail-content ${d.type}`}>{d.content}</div>
            </div>
          ))}
          <p className="change-reason">{change.reason}</p>
        </div>
      ))}
    </ResultCard>
  );
}

// ===== 6. Risk Check =====
function RiskCard({ r }) {
  return (
    <ResultCard
      title="Risk Check"
      iconColor="red"
      copyable={false}
      delay="0.3s"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
    >
      <ul className="risk-list">
        {r.risks.map((risk, i) => (
          <li className="risk-item" key={i}>
            <span className="risk-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            {risk}
          </li>
        ))}
      </ul>
    </ResultCard>
  );
}

// ===== MAIN RESULTS SECTION =====
export default function ResultsSection() {
  const { state, dispatch, showToast } = useApp();
  const resultsRef = useRef(null);
  const r = state.analysisResults;

  if (!r) return null;

  const handleCopyAll = () => {
    const text = resultsRef.current?.innerText || '';
    navigator.clipboard.writeText(text).then(() => showToast('All results copied!', 'success'));
  };

  const handleExport = () => {
    const text = resultsRef.current?.innerText || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Results exported as .txt', 'success');
  };

  const handleReanalyze = () => {
    dispatch({ type: 'CLEAR_RESULTS' });
    const el = document.getElementById('jd-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="content-section" id="results-section">
      <div className="section-header">
        <span className="section-tag">Results</span>
        <h2 className="section-title">Resume Tailoring Report</h2>
        <p className="section-desc">
          Your personalized, ATS-optimized recommendations based on exact experience matches.
        </p>
      </div>

      <div className="results-toolbar">
        <button className="btn btn-ghost btn-sm" onClick={handleCopyAll}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          Copy All
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export .txt
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleReanalyze}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          Re-analyze
        </button>
      </div>

      <div className="results-content" ref={resultsRef}>
        <BestResumeCard r={r} />
        <ScoreCard r={r} />
        <JobAnalysisCard r={r} />
        <GapAnalysisCard r={r} />
        <ChangesCard r={r} />
        <RiskCard r={r} />
      </div>
    </section>
  );
}
