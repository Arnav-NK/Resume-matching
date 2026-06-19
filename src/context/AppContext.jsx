// =============================================
// ResumeForge AI — Global App Context
// =============================================
import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  resumes: [null, null],       // { file, name, size, text, parsed, status }
  jdText: '',
  targetRole: 'auto',
  currentStep: 1,
  analysisResults: null,
  isAnalyzing: false,
  loadingStep: 0,
  history: JSON.parse(localStorage.getItem('resumeforge_history') || '[]'),
  historyOpen: false,
  toasts: [],
  totalAnalyses: JSON.parse(localStorage.getItem('resumeforge_history') || '[]').length,
  totalKeywords: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_RESUME':
      const resumes = [...state.resumes];
      resumes[action.slot] = action.payload;
      return { ...state, resumes };
    case 'REMOVE_RESUME':
      const r = [...state.resumes];
      r[action.slot] = null;
      return { ...state, resumes: r };
    case 'SET_JD':
      return { ...state, jdText: action.payload };
    case 'SET_TARGET_ROLE':
      return { ...state, targetRole: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: Math.max(state.currentStep, action.payload) };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_LOADING_STEP':
      return { ...state, loadingStep: action.payload };
    case 'SET_RESULTS':
      return { ...state, analysisResults: action.payload, currentStep: 4 };
    case 'CLEAR_RESULTS':
      return { ...state, analysisResults: null };
    case 'TOGGLE_HISTORY':
      return { ...state, historyOpen: !state.historyOpen };
    case 'CLOSE_HISTORY':
      return { ...state, historyOpen: false };
    case 'ADD_HISTORY': {
      const newHistory = [action.payload, ...state.history].slice(0, 20);
      localStorage.setItem('resumeforge_history', JSON.stringify(newHistory));
      return {
        ...state,
        history: newHistory,
        totalAnalyses: state.totalAnalyses + 1,
        totalKeywords: state.totalKeywords + (action.keywordsMatched || 0),
      };
    }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'RESET': {
      return {
        ...initialState,
        history: state.history,
        totalAnalyses: state.totalAnalyses,
        totalKeywords: state.totalKeywords,
        toasts: state.toasts,
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3500);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
