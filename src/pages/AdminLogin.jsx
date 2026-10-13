import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Login successful. Opening dashboard...");
        navigate("/admin");
      } else {
        setMessage(data.message || "Invalid Admin ID or password.");
      }
    } catch (error) {
      setMessage(
        "Cannot connect to the server. Make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p>Sign in to manage civic issues.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="adminId">Admin ID</label>
          <input
            id="adminId"
            type="text"
            value={adminId}
            onChange={(event) => setAdminId(event.target.value)}
            placeholder="Enter Admin ID"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In Securely →"}
          </button>
        </form>

        {message && <p className="admin-login-message">{message}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;