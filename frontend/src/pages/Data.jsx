import { useEffect, useState } from "react";

function Data() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET = read list of users
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users"); // GET
      if (!res.ok) throw new Error("Failed to load users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Data Table</h2>

      <button type="button" onClick={loadUsers} style={{ marginBottom: "10px" }}>
        Refresh
      </button>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>About Me</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Birthdate</th>
            <th>Step2 Done</th>
            <th>Step3 Done</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.about_me || ""}</td>
              <td>{u.street || ""}</td>
              <td>{u.city || ""}</td>
              <td>{u.state || ""}</td>
              <td>{u.zip || ""}</td>
              <td>{u.birthdate || ""}</td>
              <td>{String(u.step2_completed)}</td>
              <td>{String(u.step3_completed)}</td>
              <td>{u.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <p>No users yet.</p>}
    </div>
  );
}

export default Data;
