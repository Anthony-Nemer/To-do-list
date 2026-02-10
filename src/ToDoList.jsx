// ToDoList.js
import React, { useState, useRef, useEffect } from "react";
import Snowfall from "react-snowfall";

const SESSION_KEY = "todo_session_v1";

const MOTIVATION_QUOTES = [
  "I believe in you baby 💖",
  "You can do this baby 💪",
  "Focus baby… I see you 👀",
  "One task at a time baby 🫶",
  "You’re stronger than you think 🔥",
  "Finish it baby, then relax 😌",
  "Small progress is still progress ✅",
  "No distractions baby—lock in 🧠",
  "You got this, I’m proud of you 💛",
  "Keep going baby, don’t stop now 🚀",
];

// ✅ per-user storage key
const getUserStorageKey = (userId) => `todo_tasks_user_${userId}`;

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showBgVideo, setShowBgVideo] = useState(false);
  const [motivationText, setMotivationText] = useState("");
  const [user, setUser] = useState(null);

  const videoRef = useRef(null);
  const chimeRef = useRef(null);

  const reorderTasks = (list) => {
    const pending = list.filter((t) => !t.completed);
    const done = list.filter((t) => t.completed);
    return [...pending, ...done];
  };


  useEffect(() => {
    const pick =
      MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    setMotivationText(pick);
  }, []);


  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      window.location.href = "/login";
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    try {
      const saved = localStorage.getItem(getUserStorageKey(user.userId));
      if (saved) setTasks(reorderTasks(JSON.parse(saved)));
      else setTasks([]); // if first time user logs in
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(getUserStorageKey(user.userId), JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [tasks, user]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  // Create (local only)
  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    const created = { _id: crypto.randomUUID(), text, completed: false };
    setTasks((t) => reorderTasks([...t, created]));
    setNewTask("");
  }

  // Delete (local only)
  function deleteTask(index) {
    setTasks((ts) => reorderTasks(ts.filter((_, i) => i !== index)));
  }

  // Toggle complete (local only) + video celebration + sound
  function handleCompletedTask(index) {
    setTasks((ts) => {
      const t = ts[index];
      if (!t) return ts;

      const nextCompleted = !t.completed;
      const updated = ts.map((item, i) =>
        i === index ? { ...item, completed: nextCompleted } : item
      );

      // ✅ only when marking as completed (not undo)
      if (nextCompleted) {
        const a = chimeRef.current;
        if (a) {
          try {
            a.currentTime = 0;
            const p = a.play();
            if (p?.catch) p.catch(() => { });
          } catch { }
        }

        const v = videoRef.current;
        if (v) {
          try {
            v.currentTime = 0;
            v.play();
            setShowBgVideo(true);
          } catch { }
        }
      }

      return reorderTasks(updated);
    });
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => {
      setShowBgVideo(false);
      v.pause();
      v.currentTime = 0;
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "/login";
  };

  return (
    <>
      {/* ✅ Top bar: motivation (ONLY for userId === 1) */}
      {user?.userId === 1 && (
        <div className="motivation-strip" aria-label="Motivation">
          <div className="motivation-marquee">
            <span className="motivation-text">{motivationText}</span>
          </div>
        </div>
      )}

      <div
         style={{
          position: "fixed",
          right: 12,
          top: user?.userId === 1 ? 50 : 12,
          zIndex: 999999,
          pointerEvents: "auto",
        }}
      >

        {user && (
          <>
            <span style={{ marginRight: 10, fontWeight: "bold" }}>
              👋 {user.username}
            </span>
            <button onClick={logout} type="button" style={{ background:'#F3D8DC'}}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* <Snowfall color="white" /> */}

      <audio ref={chimeRef} src="/Magic%20Chime.mp3" preload="auto" />

      <video
        ref={videoRef}
        className={`bg-video ${showBgVideo ? "show" : ""}`}
        src="/celeb.mp4"
        muted
        playsInline
        preload="auto"
      />

      <div className="app-shell">
        <div className="to-do-list">
          <h1>To-Do-List</h1>

          <form onSubmit={addTask}>
            <input
              type="text"
              autoComplete="off"
              name="task"
              inputMode="text"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="done"
              placeholder="Enter a task ..."
              value={newTask}
              onChange={handleInputChange}
            />
            <button type="submit" className="add-button">
              Add
            </button>
          </form>

          <ol className="task-grid">
            {tasks.map((task, index) => (
              <li
                key={task._id ?? index}
                style={{ backgroundColor: task.completed ? "darkgrey" : "white" }}
              >
                <span className="text" style={{ fontWeight: "bold" }}>
                  {task.text}
                </span>

                <button className="delete-button" onClick={() => deleteTask(index)}>
                  Delete
                </button>

                <button
                  className="complete-button"
                  onClick={() => handleCompletedTask(index)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

export default ToDoList;
