import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage";
import ToDoList from "./ToDoList";

const SESSION_KEY = "todo_session_v1";

function App() {
  const [session, setSession] = useState(() => localStorage.getItem(SESSION_KEY));

  // Optional: if session changes in another tab
  useEffect(() => {
    const onStorage = () => setSession(localStorage.getItem(SESSION_KEY));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setSession={setSession} />} />

        <Route
          path="/tasks"
          element={session ? <ToDoList /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/"
          element={<Navigate to={session ? "/tasks" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
