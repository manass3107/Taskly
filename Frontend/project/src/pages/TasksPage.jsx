// src/pages/TasksPage.jsx
import React, { useState } from 'react';
import TaskList from './TaskList'; // Make sure this import path is correct

console.log("TasksPage rendered");

const TasksPage = () => {
  const [showMyTasks, setShowMyTasks] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Task Management
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-2 flex gap-2">
            <button 
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
                !showMyTasks 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl' 
                  : 'text-purple-300 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setShowMyTasks(false)}
            >
              Open Tasks
            </button>
            <button 
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
                showMyTasks 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl' 
                  : 'text-purple-300 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setShowMyTasks(true)}
            >
              My Tasks
            </button>
          </div>
        </div>

        {/* Task List */}
        <TaskList showMyTasks={showMyTasks} />
      </div>
    </div>
  );
};

export default TasksPage;