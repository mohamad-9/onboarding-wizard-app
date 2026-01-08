import { useState } from "react";

function Step1CreateAccount({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // POST because we CREATE a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/start", {
        method: "POST", // POST = create data
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to create user");
      }

      const data = await response.json();

      // Save user_id so we can resume later
      localStorage.setItem("user_id", String(data.id));
      localStorage.setItem("onboarding_step", "2");

      onSuccess(); // tell wizard to move to step 2
    } catch (err) {
      setError("Failed to create user. Try a new email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Step 1: Create Account</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={{ marginTop: "15px" }} disabled={loading}>
          {loading ? "Creating..." : "Continue → Step 2"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Step1CreateAccount;
