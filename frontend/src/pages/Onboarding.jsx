import { useEffect, useState } from "react";

function Onboarding() {
  const userId = localStorage.getItem("user_id");

  const [config, setConfig] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);



  // 🔹 GET config when page loads
  useEffect(() => {
  loadConfig();
  }, []);
  const loadConfig = () => {
  fetch("http://127.0.0.1:8000/api/config")
    .then((res) => res.json())
    .then((data) => setConfig(data))
    .catch((err) => console.error("Failed to load config", err));
};


  // 🔹 POST step 2 data
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/step2`,
        {
          method: "POST", // POST = save data
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            about_me: aboutMe,
            street,
            city,
            state,
            zip,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save step 2");
      }

      alert("Step 2 saved successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <p>Loading configuration...</p>;
  }

  return (
    <div>
      <h2>Step 2: Additional Information</h2>
      <button type="button" onClick={loadConfig} style={{ marginBottom: "10px" }}>
  Reload Config
</button>


      <form onSubmit={handleStep2Submit}>
        {/* About Me */}
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

        {/* Address */}
        {config.step2_address && (
          <>
            <div>
              <label>Street</label>
              <input value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
            <div>
              <label>City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label>State</label>
              <input value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div>
              <label>Zip</label>
              <input value={zip} onChange={(e) => setZip(e.target.value)} />
            </div>
          </>
        )}

        <button disabled={loading}>
          {loading ? "Saving..." : "Save Step 2"}
        </button>
        
      </form>
    </div>
  );
}

export default Onboarding;
