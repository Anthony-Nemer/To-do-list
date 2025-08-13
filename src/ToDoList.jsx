import React, { useState, useRef, useEffect } from 'react';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showBgVideo, setShowBgVideo] = useState(false);
  const videoRef = useRef(null);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask(event) {
    event.preventDefault();
    if (newTask.trim() !== "") {
      setTasks(t => [...t, { text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    setTasks(tasks => tasks.filter((_, i) => i !== index));
  }

  function handleCompletedTask(index) {
    setTasks(prev =>
      prev.map((task, i) => {
        if (i !== index) return task;
        const nextCompleted = !task.completed;

        if (nextCompleted) {
          const v = videoRef.current;
          if (v) {
            try {
              v.currentTime = 0;
              v.play();                 // will autoplay because muted
              setShowBgVideo(true);     // fade in
            } catch {
              /* ignore play promise errors */
            }
          }
        }
        return { ...task, completed: nextCompleted };
      })
    );
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onEnded = () => {
      setShowBgVideo(false); // fade out
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
        src="/celeb.mp4"   // put your file in /public/videos/
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
                key={index}
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
