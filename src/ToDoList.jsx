import React, { useState, useRef, useEffect } from 'react';

// Configure via .env (Vite):
// VITE_API_BASE=https://your-api-host.onrender.com
// VITE_API_TOKEN=supersecrettoken   (optional, only if you enabled API auth)
const API_BASE  = import.meta.env.VITE_API_BASE;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showBgVideo, setShowBgVideo] = useState(false);
  const videoRef = useRef(null);

  const headers = {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  };

  // Load tasks on mount
  useEffect(() => {
    if (!API_BASE) {
      console.warn('VITE_API_BASE is not set. Tasks will not persist.');
      return;
    }
    fetch(`${API_BASE}/tasks`, { headers })
      .then(r => {
        if (!r.ok) throw new Error(`Fetch tasks failed: ${r.status}`);
        return r.json();
      })
      .then(setTasks)
      .catch(err => console.error(err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  // Create (persisted)
  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
    })
      .then(r => {
        if (!r.ok) throw new Error(`Create failed: ${r.status}`);
        return r.json();
      })
      .then(created => {
        setTasks(t => [...t, created]);
        setNewTask('');
      })
      .catch(err => console.error(err));
  }

  // Delete (persisted)
  function deleteTask(index) {
    const id = tasks[index]?._id;
    if (!id) return;

    // optimistic UI
    const prev = tasks;
    setTasks(ts => ts.filter((_, i) => i !== index));

    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers,
    })
      .then(r => {
        if (!r.ok && r.status !== 204) throw new Error(`Delete failed: ${r.status}`);
      })
      .catch(err => {
        console.error(err);
        setTasks(prev); // rollback
      });
  }

  // Toggle complete (persisted) + video celebration
  function handleCompletedTask(index) {
    const task = tasks[index];
    if (!task?._id) return;

    const nextCompleted = !task.completed;

    // optimistic UI
    setTasks(ts => ts.map((t, i) => (i === index ? { ...t, completed: nextCompleted } : t)));

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

    fetch(`${API_BASE}/tasks/${task._id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ completed: nextCompleted }),
    }).then(r => {
      if (!r.ok) throw new Error(`Update failed: ${r.status}`);
      return r.json();
    }).catch(err => {
      console.error(err);
      // rollback
      setTasks(ts => ts.map((t, i) => (i === index ? { ...t, completed: !nextCompleted } : t)));
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
