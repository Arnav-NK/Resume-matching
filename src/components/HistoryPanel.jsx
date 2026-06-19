import { useApp } from '../context/AppContext';

export default function HistoryPanel() {
  const { state, dispatch } = useApp();

  if (!state.historyOpen) return null;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Analysis History</h3>
        <button className="btn-icon" onClick={() => dispatch({ type: 'CLOSE_HISTORY' })}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="history-list">
        {state.history.length === 0 ? (
          <p className="history-empty">No analysis history yet.</p>
        ) : (
          state.history.map((entry) => (
            <div className="history-item" key={entry.id}>
              <p className="history-item-role">{entry.role}</p>
              <p className="history-item-date">{entry.date} · {entry.bestResume}</p>
              <span className={`history-item-confidence confidence-badge ${entry.confidence.toLowerCase()}`}>
                {entry.score}% — {entry.confidence}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
