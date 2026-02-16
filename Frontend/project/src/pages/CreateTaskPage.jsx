import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaMoneyBillWave, FaClock, FaLayerGroup, FaExclamationCircle } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API || "http://localhost:3000";

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [participationFee, setParticipationFee] = useState('');
  const [componentType, setComponentType] = useState('');
  const [deadline, setDeadline] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !budget || !participationFee || !componentType || !deadline) {
      alert('Please fill all fields!');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          participationFee: Number(participationFee),
          componentType,
          deadline
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Task creation failed');
      }

      alert('✅ Task created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error creating task:', err);
      alert(`❌ ${err.message}`);
    }
  };

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white border border-red-100 shadow-sm text-red-600 px-6 py-4 rounded-xl flex items-center gap-3">
        <FaExclamationCircle className="text-xl" />
        <p className="font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Create a New Task</h1>
          <p className="text-lg text-gray-600">Post your requirements and connect with expert freelancers.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Project Title</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 text-gray-400">
                    <FaEdit />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build a React Native App"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the project requirements, deliverables, and any specific skills needed..."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              {/* Budget & Fee Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Budget (₹)</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 text-gray-400">
                      <FaMoneyBillWave />
                    </div>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Participation Fee (₹)</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 text-gray-400">
                      <FaMoneyBillWave />
                    </div>
                    <input
                      type="number"
                      value={participationFee}
                      onChange={(e) => setParticipationFee(e.target.value)}
                      placeholder="50"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Fee charged to freelancers to apply.</p>
                </div>
              </div>

              {/* Type & Deadline Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Component Type</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 text-gray-400">
                      <FaLayerGroup />
                    </div>
                    <input
                      type="text"
                      value={componentType}
                      onChange={(e) => setComponentType(e.target.value)}
                      placeholder="e.g. Frontend"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Deadline</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 text-gray-400">
                      <FaClock />
                    </div>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-md"
                >
                  Create Task
                </button>
              </div>

            </form>
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-100 flex gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
              <FaExclamationCircle />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-bold text-gray-900 mb-1">Pro Tip</p>
              <p>Detailed descriptions and realistic budgets attract better talent. The participation fee helps ensure only serious freelancers apply to your project.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;