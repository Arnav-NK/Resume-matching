import { useApp } from '../context/AppContext';

const STEPS = [
  'Extracting JD keywords...',
  'Comparing resume content...',
  'Calculating ATS alignment...',
  'Generating recommendations...',
];

export default function LoadingOverlay() {
  const { state } = useApp();

  if (!state.isAnalyzing) return null;

  const progress = (state.loadingStep / STEPS.length) * 100;

  return (
    <div className="analysis-loading">
      <div className="loading-card">
        <div className="loading-icon">
          <div className="pulse-ring" />
          <div className="pulse-ring delay-1" />
          <div className="pulse-ring delay-2" />
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#loadGrad)" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#a78bfa" /><stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3 className="loading-title">Analyzing Your Resume Match</h3>
        <div className="loading-steps">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            let cls = 'loading-step';
            if (stepNum < state.loadingStep) cls += ' done';
            else if (stepNum === state.loadingStep) cls += ' active';
            return (
              <div key={i} className={cls}>
                <div className="ls-dot" />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="loading-bar">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
