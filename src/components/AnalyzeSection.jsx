import { useApp } from '../context/AppContext';
import { performAnalysis } from '../utils/analysisEngine';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AnalyzeSection() {
  const { state, dispatch, showToast } = useApp();

  const hasResume = state.resumes.some((r) => r && r.parsed);
  const hasJD = state.jdText.trim().length > 30;
  const ready = hasResume && hasJD;

  let hint = 'Upload at least 1 resume and paste a job description to begin.';
  if (!hasResume && hasJD) hint = 'Upload at least 1 resume to continue.';
  else if (hasResume && !hasJD) hint = 'Paste a job description (minimum 30 characters).';
  else if (ready) hint = 'Ready to analyze! Click the button above.';

  const handleAnalyze = async () => {
    dispatch({ type: 'SET_ANALYZING', payload: true });
    dispatch({ type: 'SET_LOADING_STEP', payload: 1 });

    // Animated steps
    for (let i = 1; i <= 4; i++) {
      await sleep(600 + Math.random() * 400);
      dispatch({ type: 'SET_LOADING_STEP', payload: i });
    }

    await sleep(400);
    const results = performAnalysis(state.resumes, state.jdText);
    await sleep(200);

    dispatch({ type: 'SET_ANALYZING', payload: false });
    dispatch({ type: 'SET_LOADING_STEP', payload: 0 });

    if (results.error) {
      showToast(results.error, 'error');
      return;
    }

    dispatch({ type: 'SET_RESULTS', payload: results });
    dispatch({
      type: 'ADD_HISTORY',
      payload: {
        id: Date.now(),
        date: new Date().toLocaleString(),
        role: results.roleInfo.role,
        seniority: results.roleInfo.seniority,
        confidence: results.confidence,
        score: results.score,
        bestResume: results.bestResume,
      },
      keywordsMatched: results.strongMatches.length,
    });

    showToast('Analysis complete!', 'success');

    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section className="analyze-section" id="analyze-section">
      <button
        className="btn btn-analyze"
        disabled={!ready || state.isAnalyzing}
        onClick={handleAnalyze}
      >
        {state.isAnalyzing ? (
          <span className="btn-analyze-loading">
            <div className="spinner" />
            Analyzing...
          </span>
        ) : (
          <span className="btn-analyze-content">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Analyze &amp; Tailor Resume
          </span>
        )}
      </button>
      <p className="analyze-hint">{hint}</p>
    </section>
  );
}
