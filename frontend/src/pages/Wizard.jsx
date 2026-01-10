import { useEffect, useState } from "react";
import Step1CreateAccount from "../components/Step1CreateAccount";
import Step2AdditionalInfo from "../components/Step2AdditionalInfo";
import Step3FinalInfo from "../components/Step3FinalInfo";

function Wizard() {
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null); // ✅ DB-backed user progress
  const [loadingUser, setLoadingUser] = useState(true);

  const userId = localStorage.getItem("user_id");

  // GET config (read-only)
  const loadConfig = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/config"); // GET
    const data = await res.json();
    setConfig(data);
  };

  // GET user progress (read-only)
  const loadUser = async () => {
    if (!userId) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`); // GET
      if (!res.ok) {
        // user not found or deleted -> clear localStorage
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

  // Decide which step based on DB flags
  const showStep1 = !userId || !user;
  const showStep2 = user && !user.step2_completed;
  const showStep3 = user && user.step2_completed && !user.step3_completed;
  const showComplete = user && user.step3_completed;

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
        </div>
      )}
    </div>
  );
}

export default Wizard;
