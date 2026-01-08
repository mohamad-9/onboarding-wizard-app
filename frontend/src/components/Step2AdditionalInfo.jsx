import { useState } from "react";

function Step2AdditionalInfo({ config, userId, onNext }) {
  const [aboutMe, setAboutMe] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  // ✅ Add birthdate here too if admin enables it for Step 2
  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);

  // POST because we UPDATE user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/step2`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            about_me: aboutMe,
            street,
            city,
            state: stateVal,
            zip,

            // ✅ Step 2 can optionally include birthdate too
            birthdate: birthdate || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save step 2");

      localStorage.setItem("onboarding_step", "3");
      onNext();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Step 2: Additional Information</h3>

      <form onSubmit={handleSubmit}>
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

        {/* ✅ Birthdate on Step 2 if enabled */}
        {config.step2_birthdate && (
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
          {loading ? "Saving..." : "Save Step 2 → Step 3"}
        </button>
      </form>
    </div>
  );
}

export default Step2AdditionalInfo;
