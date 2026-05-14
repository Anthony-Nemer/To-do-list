import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Snowfall from "react-snowfall";

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

const STORAGE_KEY = "todo_tasks";

function createTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showBgVideo, setShowBgVideo] = useState(false);
  const [motivationText, setMotivationText] = useState("");

  const videoRef = useRef(null);
  const chimeRef = useRef(null);

  const nav = useNavigate();
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
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(reorderTasks(JSON.parse(saved)));
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask(event) {
    event.preventDefault();

    const text = newTask.trim();
    if (!text) return;

    const created = {
      _id: createTaskId(),
      text,
      completed: false,
    };

    setTasks((t) => reorderTasks([...t, created]));
    setNewTask("");
  }

  function deleteTask(index) {
    setTasks((ts) => reorderTasks(ts.filter((_, i) => i !== index)));
  }

  function handleCompletedTask(index) {
    setTasks((ts) => {
      const task = ts[index];
      if (!task) return ts;

      const nextCompleted = !task.completed;

      const updated = ts.map((item, i) =>
        i === index ? { ...item, completed: nextCompleted } : item
      );

      if (nextCompleted) {
        const audio = chimeRef.current;
        if (audio) {
          try {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise?.catch) playPromise.catch(() => { });
          } catch { }
        }

        const video = videoRef.current;
        if (video) {
          try {
            video.currentTime = 0;
            video.play();
            setShowBgVideo(true);
          } catch { }
        }
      }

      return reorderTasks(updated);
    });
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      setShowBgVideo(false);
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener("ended", onEnded);

    return () => video.removeEventListener("ended", onEnded);
  }, []);

  return (
    <>
      {motivationText && (
        <div className="motivation-strip" aria-label="Motivation">
          <div className="motivation-marquee">
            <span className="motivation-text">{motivationText}</span>
          </div>
        </div>
      )}


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
                style={{
                  backgroundColor: task.completed ? "darkgrey" : "white",
                }}
              >
                <span className="text" style={{ fontWeight: "bold" }}>
                  {task.text}
                </span>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>

                <button
                  type="button"
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
      <button
        type="button"
        className="easter-egg-button"
        onClick={() => nav("/flowers")}
      >
        Oups Whats this?
      </button>
    </>
  );
}

export default ToDoList;