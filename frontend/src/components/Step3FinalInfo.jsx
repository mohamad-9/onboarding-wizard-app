import { useState } from "react";

function Step3FinalInfo({ config, userId }) {
  const [aboutMe, setAboutMe] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);

  // POST because we UPDATE user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/step3`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            about_me: aboutMe,
            street,
            city,
            state: stateVal,
            zip,
            birthdate: birthdate || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save step 3");

      alert("🎉 Onboarding complete!");
      localStorage.setItem("onboarding_step", "3");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Step 3: Final Info</h3>

      <form onSubmit={handleSubmit}>
        {config.step3_about_me && (
          <div>
            <label>About Me</label>
            <br />
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
            />
          </div>
        )}

        {config.step3_address && (
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

        {config.step3_birthdate && (
          <div style={{ marginTop: "10px" }}>
            <label>Birthdate</label>
            <br />
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
        )}

        <button disabled={loading} style={{ marginTop: "15px" }}>
          {loading ? "Saving..." : "Finish Onboarding"}
        </button>
      </form>
    </div>
  );
}

export default Step3FinalInfo;
