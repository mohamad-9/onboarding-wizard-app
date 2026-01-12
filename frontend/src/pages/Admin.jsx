import { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";

function Admin() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET = read config
  const loadConfig = async () => {
    const res = await fetch(apiUrl("/api/config"));
    const data = await res.json();
    setConfig(data);
  };

  useEffect(() => {
    loadConfig().catch(console.error);
  }, []);

  const updateField = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    // Step 2 must have at least one enabled
    const step2Count =
      (config.step2_about_me ? 1 : 0) +
      (config.step2_address ? 1 : 0) +
      (config.step2_birthdate ? 1 : 0);

    // Step 3 must have at least one enabled
    const step3Count =
      (config.step3_about_me ? 1 : 0) +
      (config.step3_address ? 1 : 0) +
      (config.step3_birthdate ? 1 : 0);

    if (step2Count < 1)
      return "Step 2 must have at least one component enabled.";
    if (step3Count < 1)
      return "Step 3 must have at least one component enabled.";
    return null;
  };

  // POST = save config
  const handleSave = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/config"), {
        method: "POST", // POST = update/save
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step2_about_me: config.step2_about_me,
          step2_address: config.step2_address,
          step2_birthdate: config.step2_birthdate,
          step3_about_me: config.step3_about_me,
          step3_address: config.step3_address,
          step3_birthdate: config.step3_birthdate,
        }),
      });

      if (!res.ok) throw new Error("Failed to save config");
      await loadConfig();
      alert("✅ Config saved!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!config) return <p>Loading admin config...</p>;

  return (
    <div>
      <h2>Admin Config</h2>
      <p>Choose which components appear on Step 2 and Step 3.</p>

      <h3>Step 2 Components</h3>
      <label>
        <input
          type="checkbox"
          checked={config.step2_about_me}
          onChange={(e) => updateField("step2_about_me", e.target.checked)}
        />
        About Me
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={config.step2_address}
          onChange={(e) => updateField("step2_address", e.target.checked)}
        />
        Address
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={config.step2_birthdate}
          onChange={(e) => updateField("step2_birthdate", e.target.checked)}
        />
        Birthdate
      </label>

      <h3 style={{ marginTop: "20px" }}>Step 3 Components</h3>
      <label>
        <input
          type="checkbox"
          checked={config.step3_about_me}
          onChange={(e) => updateField("step3_about_me", e.target.checked)}
        />
        About Me
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={config.step3_address}
          onChange={(e) => updateField("step3_address", e.target.checked)}
        />
        Address
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={config.step3_birthdate}
          onChange={(e) => updateField("step3_birthdate", e.target.checked)}
        />
        Birthdate
      </label>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Config"}
        </button>
      </div>
    </div>
  );
}

export default Admin;
