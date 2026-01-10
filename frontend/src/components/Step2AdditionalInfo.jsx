import { useState } from "react";

function Step2AdditionalInfo({ config, userId, onNext }) {
  const [aboutMe, setAboutMe] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    // If About Me component is ON, require it
    if (config.step2_about_me) {
      if (!aboutMe.trim()) return "About Me is required.";
    }

    // If Address component is ON, require all address fields
    if (config.step2_address) {
      if (!street.trim()) return "Street is required.";
      if (!city.trim()) return "City is required.";
      if (!stateVal.trim()) return "State is required.";
      if (!zip.trim()) return "Zip is required.";
    }

    // If Birthdate is ON, require it
    if (config.step2_birthdate) {
      if (!birthdate) return "Birthdate is required.";
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

    // ✅ partial update body (only send enabled fields)
    const body = {};

    if (config.step2_about_me) body.about_me = aboutMe.trim();

    if (config.step2_address) {
      body.street = street.trim();
      body.city = city.trim();
      body.state = stateVal.trim();
      body.zip = zip.trim();
    }

    if (config.step2_birthdate) body.birthdate = birthdate;

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/step2`,
        {
          method: "POST", // POST = save/update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error("Failed to save step 2");

      onNext();
    } catch (err) {
      setError(err.message);
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
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Write a short bio..."
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

        {config.step2_birthdate && (
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
          {loading ? "Saving..." : "Save Step 2 → Step 3"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default Step2AdditionalInfo;
