import { useState } from "react";
import { apiUrl } from "../lib/api";

function Step3FinalInfo({ config, userId }) {
  const [aboutMe, setAboutMe] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (config.step3_about_me && !aboutMe.trim()) {
      return "About Me is required.";
    }

    if (config.step3_address) {
      if (!street.trim()) return "Street is required.";
      if (!city.trim()) return "City is required.";
      if (!stateVal.trim()) return "State is required.";
      if (!zip.trim()) return "Zip is required.";
    }

    if (config.step3_birthdate && !birthdate) {
      return "Birthdate is required.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    // ✅ partial update body (VERY IMPORTANT)
    const body = {};

    if (config.step3_about_me) body.about_me = aboutMe.trim();

    if (config.step3_address) {
      body.street = street.trim();
      body.city = city.trim();
      body.state = stateVal.trim();
      body.zip = zip.trim();
    }

    if (config.step3_birthdate) body.birthdate = birthdate;

    setLoading(true);

    try {
      const response = await fetch(
        apiUrl(`/api/users/${userId}/step3`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error("Failed to save step 3");

      alert("🎉 Onboarding complete!");
    } catch (err) {
      setError(err.message);
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
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Write a short bio..."
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
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label>City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Riyadh"
              />
            </div>

            <div>
              <label>State</label>
              <input
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="(free text)"
              />
            </div>

            <div>
              <label>Zip</label>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="12345"
              />
            </div>
          </>
        )}

        {config.step3_birthdate && (
          <div style={{ marginTop: "10px" }}>
            <label>Birthdate</label>
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

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default Step3FinalInfo;
