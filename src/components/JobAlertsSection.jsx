import { useState, useEffect } from 'react';

export default function JobAlertsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the Job Alerts backend. Make sure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <section className="content-section" id="job-alerts">
      <div className="section-header">
        <span className="section-tag">Live Feed</span>
        <h2 className="section-title">
          <span className="gradient-text">WhatsApp Job Alerts</span>
        </h2>
        <p className="section-desc">
          Real-time opportunities matching 2028 Grads or Summer 2027 Interns scraped from your WhatsApp channel.
        </p>
        <button 
          className="btn btn-ghost" 
          onClick={fetchJobs} 
          style={{ marginTop: '16px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: loading ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>Refresh Jobs</span>
        </button>
      </div>

      <div className="upload-grid" style={{ gridTemplateColumns: '1fr' }}>
        {loading ? (
          <div className="file-info" style={{ justifyContent: 'center', padding: '32px' }}>
            <p className="file-name">Syncing with WhatsApp...</p>
          </div>
        ) : error ? (
          <div className="file-info" style={{ borderColor: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.05)' }}>
            <div className="file-details">
              <p className="file-name" style={{ color: 'var(--accent-red)' }}>Connection Error</p>
              <p className="file-size">{error}</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="drop-zone">
            <div className="drop-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p className="drop-title">No jobs found yet</p>
            <p className="drop-hint">Start the WhatsApp backend and wait for messages in "Job Alerts".</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {jobs.map((job) => (
              <div key={job.id} className="file-info" style={{ alignItems: 'flex-start', flexDirection: 'column', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
                  <span className="status-badge parsed" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {job.chatName}
                  </span>
                  <span className="file-size" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {new Date(job.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9375rem', 
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  border: '1px solid var(--border)'
                }}>
                  {job.text}
                </div>

                {job.links && job.links.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {job.links.map((link, i) => (
                      <a 
                        key={i} 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      >
                        <span>Apply / View Link {job.links.length > 1 ? i + 1 : ''}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '6px' }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
