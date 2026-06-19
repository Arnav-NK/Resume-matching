import { useApp } from '../context/AppContext';

export default function StepsBar() {
  const { state } = useApp();
  const current = state.currentStep;

  const steps = [
    { num: 1, label: 'Upload Resumes' },
    { num: 2, label: 'Paste JD' },
    { num: 3, label: 'Analyze' },
    { num: 4, label: 'Results' },
  ];

  return (
    <div className="steps-bar" id="steps-bar">
      {steps.map((step, i) => (
        <div key={step.num} style={{ display: 'contents' }}>
          <div
            className={`step ${step.num === current ? 'active' : ''} ${step.num < current ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {step.num < current ? '✓' : step.num}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-connector ${i < current - 1 ? 'filled' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}
