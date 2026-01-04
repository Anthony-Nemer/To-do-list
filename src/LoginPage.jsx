// LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "./users.json";

const SESSION_KEY = "todo_session_v1";

export default function LoginPage({ setSession }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) navigate("/tasks", { replace: true });
  }, [navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const u = users.find(
      (x) => x.username.toLowerCase() === username.trim().toLowerCase() && x.password === password
    );

    if (!u) {
      setErr("Invalid username or password");
      return;
    }

    const sessionObj = { userId: u.id, username: u.username };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
    setSession(JSON.stringify(sessionObj));
    navigate("/tasks", { replace: true });
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoCircle}>✓</div>
          <div>
            <h2 style={styles.title}>Welcome back</h2>
            <p style={styles.subtitle}>Log in to continue to your tasks</p>
          </div>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {err && <div style={styles.error}>{err}</div>}

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 18,

    // ✅ pink-friendly gradient (soft + less harsh navy)
    background:
      "radial-gradient(1000px 650px at 15% 10%, rgba(255, 140, 200, 0.35), transparent 55%)," +
      "radial-gradient(900px 600px at 90% 25%, rgba(255, 200, 230, 0.28), transparent 60%)," +
      "radial-gradient(800px 550px at 50% 100%, rgba(255, 170, 210, 0.18), transparent 55%)," +
      "linear-gradient(180deg, #1b1020 0%, #120a18 45%, #0b0810 100%)",

    position: "relative",
    overflow: "hidden",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },

  blob: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: "50%",
    filter: "blur(38px)",
    opacity: 0.45,
    zIndex: 0,
  },
  // ✅ warmer pink blobs
  blob1: {
    left: -140,
    top: -180,
    background: "linear-gradient(135deg, rgba(255, 120, 200, 1), rgba(255, 210, 235, 1))",
  },
  blob2: {
    right: -180,
    bottom: -190,
    background: "linear-gradient(135deg, rgba(255, 190, 230, 1), rgba(210, 170, 255, 1))",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    zIndex: 1,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#2a0f22",
    background: "linear-gradient(135deg, #fff 0%, #ffe0ef 100%)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    userSelect: "none",
  },
  title: {
    margin: 0,
    color: "white",
    fontSize: 22,
    letterSpacing: 0.2,
  },
  subtitle: {
    margin: "4px 0 0 0",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13.5,
  },

  form: {
    display: "grid",
    gap: 10,
  },
  label: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12.5,
    marginTop: 6,
  },

  // ✅ FIX overflow: use border-box + no accidental width overflow
  input: {
    width: "100%",
    boxSizing: "border-box",        // ✅ key fix
    display: "block",               // ✅ ensures it respects container width
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(30, 12, 26, 0.55)", // ✅ slightly warmer for pink theme
    color: "white",
    outline: "none",
    fontSize: 14,
  },

  error: {
    marginTop: 2,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fecaca",
    fontSize: 13,
  },

  button: {
    marginTop: 8,
    width: "100%",
    boxSizing: "border-box", // ✅ also safe for the button
    padding: "12px 12px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: 0.3,
    color: "#2a0f22",
    background: "linear-gradient(135deg, #ffffff 0%, #ffd1e8 100%)", // ✅ pinky button
    boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
  },
};
