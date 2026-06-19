import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import StepsBar from './components/StepsBar';
import UploadSection from './components/UploadSection';
import JDSection from './components/JDSection';
import AnalyzeSection from './components/AnalyzeSection';
import LoadingOverlay from './components/LoadingOverlay';
import ResultsSection from './components/ResultsSection';
import HistoryPanel from './components/HistoryPanel';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import JobAlertsSection from './components/JobAlertsSection';
import './index.css';

function AppContent() {
  const { dispatch, showToast } = useApp();

  const handleNewAnalysis = () => {
    dispatch({ type: 'RESET' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Reset complete — ready for new analysis', 'info');
  };

  const handleToggleHistory = () => {
    dispatch({ type: 'TOGGLE_HISTORY' });
  };

  return (
    <>
      {/* Background Effects */}
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <Header onNewAnalysis={handleNewAnalysis} onToggleHistory={handleToggleHistory} />

      <main id="app-main">
        <Hero />
        <StepsBar />
        <UploadSection />
        <JDSection />
        <AnalyzeSection />
        <JobAlertsSection />
        <LoadingOverlay />
        <ResultsSection />
      </main>

      <Footer />
      <HistoryPanel />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
