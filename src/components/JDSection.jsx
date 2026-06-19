import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { extractText } from '../utils/fileParser';
import { TARGET_ROLES } from '../utils/constants';

export default function JDSection() {
  const { state, dispatch, showToast } = useApp();
  const jdFileRef = useRef(null);

  const wordCount = state.jdText.trim() ? state.jdText.trim().split(/\s+/).length : 0;
  const charCount = state.jdText.length;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      dispatch({ type: 'SET_JD', payload: text });
      dispatch({ type: 'SET_STEP', payload: state.resumes.some((r) => r?.parsed) ? 3 : 2 });
      showToast('Pasted from clipboard', 'success');
    } catch {
      showToast('Cannot access clipboard. Please paste manually.', 'error');
    }
  };

  const handleClear = () => {
    dispatch({ type: 'SET_JD', payload: '' });
  };

  const handleUploadJD = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await extractText(file);
      dispatch({ type: 'SET_JD', payload: text });
      dispatch({ type: 'SET_STEP', payload: state.resumes.some((r) => r?.parsed) ? 3 : 2 });
      showToast(`Loaded JD from ${file.name}`, 'success');
    } catch {
      showToast('Failed to parse JD file', 'error');
    }
  };

  const handleChange = (e) => {
    dispatch({ type: 'SET_JD', payload: e.target.value });
    if (e.target.value.trim().length > 30 && state.resumes.some((r) => r?.parsed)) {
      dispatch({ type: 'SET_STEP', payload: 3 });
    }
  };

  return (
    <section className="content-section" id="jd-section">
      <div className="section-header">
        <span className="section-tag">Step 2</span>
        <h2 className="section-title">Paste the Job Description</h2>
        <p className="section-desc">
          Paste the full job description below. Include the role title, requirements,
          responsibilities, and any preferred qualifications for the most accurate analysis.
        </p>
      </div>

      <div className="jd-container">
        <div className="jd-toolbar">
          <div className="jd-toolbar-left">
            <label htmlFor="target-role" className="toolbar-label">Target Role Category:</label>
            <select
              id="target-role"
              className="toolbar-select"
              value={state.targetRole}
              onChange={(e) => dispatch({ type: 'SET_TARGET_ROLE', payload: e.target.value })}
            >
              {TARGET_ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="jd-toolbar-right">
            <button className="btn btn-ghost btn-sm" onClick={handlePaste}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Paste
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              Clear
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => jdFileRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Upload
            </button>
            <input type="file" ref={jdFileRef} style={{ display: 'none' }} accept=".txt,.pdf,.docx" onChange={handleUploadJD} />
          </div>
        </div>

        <div className="jd-editor-wrap">
          <textarea
            id="jd-input"
            className="jd-textarea"
            placeholder={`Paste the complete job description here...\n\nInclude:\n• Job title and company\n• Required qualifications\n• Preferred skills\n• Responsibilities\n• Any other relevant details`}
            spellCheck={false}
            value={state.jdText}
            onChange={handleChange}
          />
          <div className="jd-counter">
            <span>{wordCount}</span> words · <span>{charCount}</span> characters
          </div>
        </div>
      </div>
    </section>
  );
}
