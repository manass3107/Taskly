// src/pages/TasksPage.jsx
import React, { useState } from 'react';
import TaskList from './TaskList';

console.log("TasksPage rendered");

const TasksPage = () => {
  const [showMyTasks, setShowMyTasks] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Task Management
        </h1>
        <p className="text-gray-600">Browse available tasks or manage your own</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
          <button
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${!showMyTasks
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
            onClick={() => setShowMyTasks(false)}
          >
            Open Tasks
          </button>
          <button
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${showMyTasks
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
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
  );
};

export default TasksPage;