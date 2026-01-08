import { useEffect, useState } from "react";

function Onboarding() {
  const userId = localStorage.getItem("user_id");

  // Track which step user is on (2 or 3)
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem("onboarding_step");
    return saved ? Number(saved) : 2;
  });

  const [config, setConfig] = useState(null);

  // Step 2 fields
  const [aboutMe, setAboutMe] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  // Step 3 fields
  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);

  // GET config
  const loadConfig = () => {
    fetch("http://127.0.0.1:8000/api/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Failed to load config", err));
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Save step in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("onboarding_step", String(step));
  }, [step]);

  // POST step 2
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("No user_id found. Please complete Step 1 first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/step2`,
        {
          method: "POST", // POST = save/update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            about_me: aboutMe,
            street,
            city,
            state: stateVal,
            zip,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save Step 2");

      alert("✅ Step 2 saved!");
      setStep(3); // go next
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST step 3
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("No user_id found. Please complete Step 1 first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/step3`,
        {
          method: "POST", // POST = save/update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            birthdate: birthdate || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save Step 3");

      alert("🎉 Step 3 saved! Onboarding complete.");
      localStorage.setItem("onboarding_step", "3");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // A small “restart onboarding” button for testing
  const restart = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("onboarding_step");
    alert("Cleared localStorage. Now do Step 1 again.");
  };

  if (!config) return <p>Loading configuration...</p>;

  if (!userId) {
    return (
      <div>
        <h2>Missing Step 1</h2>
        <p>
          No user_id found. Please go back and complete Step 1 (Create Account).
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Onboarding Wizard</h2>

      <div style={{ marginBottom: "10px" }}>
        <button type="button" onClick={loadConfig}>
          Reload Config
        </button>{" "}
        <button type="button" onClick={restart}>
          Restart (Clear localStorage)
        </button>
      </div>

      <p>
        <strong>Current Step:</strong> {step}
      </p>

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit}>
          <h3>Step 2: Additional Information</h3>

          {config.step2_about_me && (
            <div>
              <label>About Me</label>
              <br />
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
          )}

          {config.step2_address && (
            <>
              <div>
                <label>Street</label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div>
                <label>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label>State</label>
                <input
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                />
              </div>
              <div>
                <label>Zip</label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
            </>
          )}

          <button disabled={loading}>
            {loading ? "Saving..." : "Save Step 2 → Step 3"}
          </button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit}>
          <h3>Step 3: Final Info</h3>

          {config.step3_birthdate && (
            <div>
              <label>Birthdate</label>
              <br />
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
          )}

          {/* (Optional future) Step3 AboutMe/Address if you ever enable them */}
          {/* We can add those later if admin config uses them */}

          <button disabled={loading}>
            {loading ? "Saving..." : "Finish Onboarding"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Onboarding;
