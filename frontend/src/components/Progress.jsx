function Progress({ currentStep }) {
  const steps = [
    { number: 1, label: "Create Account" },
    { number: 2, label: "Additional Info" },
    { number: 3, label: "Final Info" },
  ];

  return (
    <div className="progress">
      {steps.map((s, idx) => {
        const isActive = s.number === currentStep;
        const isDone = s.number < currentStep;

        return (
          <div key={s.number} className={`progress-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
            <div className="progress-circle">
              {isDone ? "✓" : s.number}
            </div>

            <div className="progress-label">{s.label}</div>

            {idx < steps.length - 1 && <div className="progress-line" />}
          </div>
        );
      })}
    </div>
  );
}

export default Progress;
