import { useEffect, useState } from "react";
import Step1CreateAccount from "../components/Step1CreateAccount";
import Step2AdditionalInfo from "../components/Step2AdditionalInfo";
import Step3FinalInfo from "../components/Step3FinalInfo";

function Wizard() {
  const [config, setConfig] = useState(null);

  const userId = localStorage.getItem("user_id");
  const step = Number(localStorage.getItem("onboarding_step") || "1");

  // GET config (read-only)
  const loadConfig = () => {
    fetch("http://127.0.0.1:8000/api/config") // GET
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Failed to load config", err));
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const restart = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("onboarding_step");
    window.location.reload();
  };

  if (!config) return <p>Loading config...</p>;

  return (
    <div>
      <h2>Onboarding Wizard</h2>

      <div style={{ marginBottom: "10px" }}>
        <button type="button" onClick={loadConfig}>
          Reload Config
        </button>{" "}
        <button type="button" onClick={restart}>
          Restart
        </button>
      </div>

      {!userId ? (
        <Step1CreateAccount onSuccess={() => window.location.reload()} />
      ) : step <= 2 ? (
        <Step2AdditionalInfo
          config={config}
          userId={userId}
          onNext={() => window.location.reload()}
        />
      ) : (
        <Step3FinalInfo config={config} userId={userId} />
      )}
    </div>
  );
}

export default Wizard;
