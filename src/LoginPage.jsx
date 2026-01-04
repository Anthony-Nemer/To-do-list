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
      (x) =>
        x.username.toLowerCase() === username.trim().toLowerCase() &&
        x.password === password
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
      {/* lighter/smaller blobs for phones */}
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />

      <div style={styles.shell}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoCircle}>✓</div>
            <div style={{ minWidth: 0 }}>
              <h2 style={styles.title}>Welcome back</h2>
              <p style={styles.subtitle}>Log in to continue</p>
            </div>
          </div>

          <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                autoComplete="username"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
            </div>

            {err && <div style={styles.error}>{err}</div>}

            <button style={styles.button} type="submit">
              Login
            </button>

            <div style={styles.footerHint}>
              Tip: username is not case sensitive.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 600px at 20% 10%, rgba(255, 130, 200, 0.28), transparent 55%)," +
      "radial-gradient(850px 600px at 90% 20%, rgba(255, 200, 230, 0.20), transparent 60%)," +
      "linear-gradient(180deg, #1b1020 0%, #120a18 55%, #0b0810 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },

  // ✅ proper centered layout on phones (no tiny card floating)
  shell: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px 16px",
  },

  blob: {
    position: "absolute",
    width: "min(340px, 80vw)", // ✅ smaller than before (phones)
    height: "min(340px, 80vw)",
    borderRadius: "50%",
    filter: "blur(42px)",
    opacity: 0.35,
    zIndex: 0,
    pointerEvents: "none",
  },
  blob1: {
    left: "-20vw",
    top: "-22vh",
    background:
      "linear-gradient(135deg, rgba(255, 110, 195, 1), rgba(255, 215, 235, 1))",
  },
  blob2: {
    right: "-22vw",
    bottom: "-24vh",
    background:
      "linear-gradient(135deg, rgba(255, 185, 230, 1), rgba(190, 160, 255, 1))",
  },

  // ✅ FULL-WIDTH on phones, capped on desktop
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
    zIndex: 1,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#2a0f22",
    background: "linear-gradient(135deg, #fff 0%, #ffd6ea 100%)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.22)",
    userSelect: "none",
    flex: "0 0 auto",
  },

  // ✅ better mobile typography
  title: {
    margin: 0,
    color: "white",
    fontSize: 20,
    lineHeight: 1.15,
  },
  subtitle: {
    margin: "3px 0 0 0",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 1.2,
  },

  form: {
    display: "grid",
    gap: 12,
  },

  field: {
    display: "grid",
    gap: 6,
  },

  label: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12.5,
  },

  // ✅ input feels much better on phones
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(25, 10, 20, 0.55)",
    color: "white",
    outline: "none",
    fontSize: 16, // ✅ prevents iOS zoom
    lineHeight: "20px",
  },

  error: {
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fecaca",
    fontSize: 13,
  },

  // ✅ bigger, nicer tap target
  button: {
    marginTop: 2,
    width: "100%",
    padding: "13px 12px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    letterSpacing: 0.3,
    color: "#2a0f22",
    background: "linear-gradient(135deg, #ffffff 0%, #ffd1e8 100%)",
    boxShadow: "0 14px 28px rgba(0,0,0,0.22)",
    minHeight: 48,
  },

  footerHint: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
};
