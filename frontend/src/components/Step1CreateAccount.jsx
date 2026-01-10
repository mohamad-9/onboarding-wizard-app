import { useState } from "react";

function Step1CreateAccount({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEmailValid = (value) => {
    // simple check for demo purposes
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!isEmailValid(email.trim())) return "Please enter a valid email (example: name@example.com).";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
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

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create user");
      }

      const data = await response.json();

      localStorage.setItem("user_id", String(data.id));
      onSuccess();
    } catch (err) {
      // Most common: duplicate email or backend validation error
      setError("Failed to create user. Try a different email.");
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
        </div>

        <button disabled={loading}>
          {loading ? "Creating..." : "Continue → Step 2"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default Step1CreateAccount;
