import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ToDoList from "./ToDoList";
import Flowers from "./Flowers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToDoList />} />
        <Route path="/flowers" element={<Flowers />} />
      </Routes>
    </Router>
  );
}

export default App;