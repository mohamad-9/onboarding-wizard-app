import { useState } from "react";

function Step3FinalInfo({ config, userId }) {
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
          method: "POST", // POST = update/save
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthdate: birthdate || null }),
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

        <button disabled={loading}>
          {loading ? "Saving..." : "Finish Onboarding"}
        </button>
      </form>
    </div>
  );
}

export default Step3FinalInfo;
