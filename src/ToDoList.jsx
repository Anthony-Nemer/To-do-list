import React, { useState, useRef, useEffect } from 'react';
import Snowfall from 'react-snowfall';

const STORAGE_KEY = 'todo_tasks_v1';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showBgVideo, setShowBgVideo] = useState(false);
  const videoRef = useRef(null);

  // ✅ helper: keep incompletes on top, preserve relative order within groups
  const reorderTasks = (list) => {
    const pending = list.filter(t => !t.completed);
    const done = list.filter(t => t.completed);
    return [...pending, ...done];
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(reorderTasks(JSON.parse(saved)));
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  // Create (local only)
  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    const created = { _id: crypto.randomUUID(), text, completed: false };
    setTasks(t => reorderTasks([...t, created]));   // ⬅️ ensure new list is ordered
    setNewTask('');
  }

  // Delete (local only)
  function deleteTask(index) {
    setTasks(ts => {
      const next = ts.filter((_, i) => i !== index);
      return reorderTasks(next);                    // ⬅️ optional, keeps invariant
    });
  }

  // Toggle complete (local only) + video celebration
  function handleCompletedTask(index) {
    setTasks(ts => {
      const t = ts[index];
      if (!t) return ts;

      const nextCompleted = !t.completed;
      const updated = ts.map((item, i) =>
        i === index ? { ...item, completed: nextCompleted } : item
      );

      if (nextCompleted) {
        const v = videoRef.current;
        if (v) {
          try {
            v.currentTime = 0;
            v.play();
            setShowBgVideo(true);
          } catch {/* ignore */}
        }
      }

      return reorderTasks(updated);                 // ⬅️ completed tasks move to bottom
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
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, []);

  return (
    <>
    <Snowfall color='white' />
      <video
        ref={videoRef}
        className={`bg-video ${showBgVideo ? 'show' : ''}`}
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
            <button type="submit" className="add-button">Add</button>
          </form>

          <ol className="task-grid">
            {tasks.map((task, index) => (
              <li
                key={task._id ?? index}
                style={{ backgroundColor: task.completed ? 'darkgrey' : 'white' }}
              >
                <span className="text" style={{ fontWeight: 'bold' }}>{task.text}</span>

                <button className="delete-button" onClick={() => deleteTask(index)}>
                  Delete
                </button>

                <button className="complete-button" onClick={() => handleCompletedTask(index)}>
                  {task.completed ? 'Undo' : 'Complete'}
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
