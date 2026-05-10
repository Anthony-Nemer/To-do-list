import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ToDoList from "./ToDoList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToDoList />} />
      </Routes>
    </Router>
  );
}

export default App;