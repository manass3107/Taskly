// src/pages/TasksPage.jsx
import React, { useState } from 'react';
import TaskList from './TaskList'; // Make sure this import path is correct
import '../TasksDarkTheme.css';

console.log("TasksPage rendered");

const TasksPage = () => {
  const [showMyTasks, setShowMyTasks] = useState(false);

  return (
    <div className="mb-4">
      <button 
        className={`task-toggle-btn ${!showMyTasks ? 'active' : ''}`}
        onClick={() => setShowMyTasks(false)}
      >
        Open Tasks
      </button>
      <button 
        className={`task-toggle-btn ${showMyTasks ? 'active' : ''}`}
        onClick={() => setShowMyTasks(true)}
      >
        My Tasks
      </button>

      <TaskList showMyTasks={showMyTasks} />
    </div>
  );
};

export default TasksPage;
