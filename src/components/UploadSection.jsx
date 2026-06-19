import { useRef, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { extractText, formatFileSize } from '../utils/fileParser';

function DropZone({ slot }) {
  const { state, dispatch, showToast } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const resume = state.resumes[slot];

  const handleFile = useCallback(async (file) => {
    const validExts = ['.docx', '.pdf', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExts.includes(ext)) {
      showToast(`Invalid file type. Supported: ${validExts.join(', ')}`, 'error');
      return;
    }

    dispatch({
      type: 'SET_RESUME',
      slot,
      payload: { file, name: file.name, size: file.size, text: '', parsed: false, status: 'parsing' },
    });

    try {
      const text = await extractText(file);
      dispatch({
        type: 'SET_RESUME',
        slot,
        payload: { file, name: file.name, size: file.size, text, parsed: true, status: 'parsed' },
      });
      dispatch({ type: 'SET_STEP', payload: 2 });
      showToast(`Resume #${slot + 1} parsed successfully`, 'success');
    } catch (err) {
      dispatch({
        type: 'SET_RESUME',
        slot,
        payload: { file, name: file.name, size: file.size, text: '', parsed: false, status: 'error' },
      });
      showToast(`Failed to parse ${file.name}: ${err.message}`, 'error');
    }
  }, [slot, dispatch, showToast]);

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_RESUME', slot });
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast(`Resume #${slot + 1} removed`, 'info');
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  if (resume) {
    return (
      <div className="upload-card">
        <div className="file-info">
          <div className="file-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="file-details">
            <p className="file-name">{resume.name}</p>
            <p className="file-size">{formatFileSize(resume.size)}</p>
          </div>
          <div className="file-status">
            {resume.status === 'parsing' && <span className="status-badge parsing">Parsing...</span>}
            {resume.status === 'parsed' && <span className="status-badge parsed">✓ Parsed</span>}
            {resume.status === 'error' && <span className="status-badge error">✗ Error</span>}
          </div>
          <button className="btn-icon btn-remove" onClick={handleRemove} title="Remove file">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-card">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="drop-zone-content">
          <div className="drop-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
          </div>
          <p className="drop-title">Resume #{slot + 1}</p>
          <p className="drop-hint">Drag & drop or <span className="browse-link">browse files</span></p>
          <p className="drop-formats">.docx, .pdf, .txt</p>
        </div>
        <input
          type="file"
          className="file-input"
          ref={fileInputRef}
          accept=".docx,.pdf,.txt"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}

function PreviewPanel() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const anyParsed = state.resumes.some((r) => r && r.parsed);

  if (!anyParsed) return null;

  const resume = state.resumes[activeTab];
  const text = resume?.parsed ? resume.text : '';

  return (
    <div className="preview-panel">
      <div className="preview-tabs">
        {state.resumes.map((r, i) => (
          <button
            key={i}
            className={`preview-tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {r ? (r.name.length > 25 ? r.name.substring(0, 22) + '...' : r.name) : `Resume #${i + 1}`}
          </button>
        ))}
      </div>
      <div className="preview-content">
        {text ? (
          text.length > 3000 ? text.substring(0, 3000) + '\n\n... (truncated)' : text
        ) : (
          <p className="preview-placeholder">No content parsed for this resume.</p>
        )}
      </div>
    </div>
  );
}

export default function UploadSection() {
  return (
    <section className="content-section" id="upload-section">
      <div className="section-header">
        <span className="section-tag">Step 1</span>
        <h2 className="section-title">Upload Your Master Resumes</h2>
        <p className="section-desc">
          Upload up to 2 master resumes. Supported formats: <strong>.docx</strong>,{' '}
          <strong>.pdf</strong>, <strong>.txt</strong>. Each resume should represent a
          different positioning of your real experience.
        </p>
      </div>
      <div className="upload-grid">
        <DropZone slot={0} />
        <DropZone slot={1} />
      </div>
      <PreviewPanel />
    </section>
  );
}
