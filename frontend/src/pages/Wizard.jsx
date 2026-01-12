import { useEffect, useState } from "react";
import Step1CreateAccount from "../components/Step1CreateAccount";
import Step2AdditionalInfo from "../components/Step2AdditionalInfo";
import Step3FinalInfo from "../components/Step3FinalInfo";
import Progress from "../components/Progress";
import { apiUrl } from "../lib/api";

function Wizard() {
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const userId = localStorage.getItem("user_id");

  // GET config
  const loadConfig = async () => {
    const res = await fetch(apiUrl("/api/config"));
    const data = await res.json();
    setConfig(data);
  };

  // GET user progress (DB-backed resume)
  const loadUser = async () => {
    if (!userId) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const res = await fetch(apiUrl(`/api/users/${userId}`));
      if (!res.ok) {
        localStorage.removeItem("user_id");
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadConfig().catch(console.error);
    loadUser().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = () => {
    localStorage.removeItem("user_id");
    setUser(null);
    window.location.reload();
  };

  const reloadAll = async () => {
    await loadConfig();
    await loadUser();
  };

  if (!config) return <p>Loading config...</p>;
  if (loadingUser) return <p>Loading user progress...</p>;

  const showStep1 = !userId || !user;
  const showStep2 = user && !user.step2_completed;
  const showStep3 = user && user.step2_completed && !user.step3_completed;
  const showComplete = user && user.step3_completed;

  // Decide current step number for progress indicator
  const currentStep = showStep1 ? 1 : showStep2 ? 2 : 3;

  return (
    <div>
      <h2>Onboarding Wizard</h2>

      <div style={{ marginBottom: "10px" }}>
        <button type="button" onClick={reloadAll}>
          Reload
        </button>{" "}
        <button type="button" className="secondary" onClick={restart}>
          Restart
        </button>
      </div>

      {/* ✅ Progress indicator */}
      {!showComplete && <Progress currentStep={currentStep} />}

      {showStep1 && (
        <Step1CreateAccount onSuccess={() => window.location.reload()} />
      )}

      {showStep2 && (
        <Step2AdditionalInfo
          config={config}
          userId={userId}
          onNext={() => window.location.reload()}
        />
      )}

      {showStep3 && <Step3FinalInfo config={config} userId={userId} />}

      {showComplete && (
        <div>
          <h3>✅ Onboarding Complete</h3>
          <p>You can view your record in the Data page.</p>
          <button type="button" className="secondary" onClick={restart}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

export default Wizard;
