import React, { useState, useRef, useEffect } from 'react';

const STORAGE_KEY = 'todo_tasks_v1';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showBgVideo, setShowBgVideo] = useState(false);
  const videoRef = useRef(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
  }, []);

  // Persist tasks to localStorage whenever they change
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
    setTasks(t => [...t, created]);
    setNewTask('');
  }

  // Delete (local only)
  function deleteTask(index) {
    setTasks(ts => ts.filter((_, i) => i !== index));
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

      // celebration video on complete
      if (nextCompleted) {
        const v = videoRef.current;
        if (v) {
          try {
            v.currentTime = 0;
            v.play();
            setShowBgVideo(true);
          } catch {
            /* ignore play promise errors */
          }
        }
      }

      return updated;
    });
  }

  // Handle background video fade-out when it ends
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
      {/* Fullscreen background video behind everything */}
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
              placeholder="Enter a task ..."
              value={newTask}
              onChange={handleInputChange}
            />
            <button type="submit" className="add-button">Add</button>
          </form>

          <ol>
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
