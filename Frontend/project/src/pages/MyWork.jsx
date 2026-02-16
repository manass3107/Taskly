import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function MyWork() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/contracts/my-contracts`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setContracts(data);
    };
    fetchContracts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Ongoing Work</h1>
        <p className="text-gray-600">Track progress on your active contracts</p>
      </div>

      {contracts.length === 0 ? (
        <div className="flex items-center justify-center mt-16">
          <div className="bg-blue-50 text-blue-600 border border-blue-100 rounded-xl px-8 py-6 text-center">
            <FaBriefcase className="mx-auto text-3xl mb-2" />
            <p>No ongoing work found.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contracts.map((c) => {
            const total = c.milestones?.length || 0;
            const completed = c.milestones?.filter((m) => m.completed).length || 0;
            const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div
                key={c._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Contract Header */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{c.taskTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status?.toLowerCase() === 'active'
                      ? 'bg-green-100 text-green-700' :
                      c.status?.toLowerCase() === 'completed'
                        ? 'bg-blue-100 text-blue-700' :
                        c.status?.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                    }`}>
                    {c.status || 'Unknown'}
                  </span>
                </div>

                {/* Deadline */}
                {c.deadline && (
                  <div className="flex items-center gap-2 mb-6 text-gray-600">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-sm">
                      <span className="font-medium">Deadline:</span>{' '}
                      {new Date(c.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-gray-600 text-sm mt-2 font-medium">
                    {progressPercent}% complete ({completed}/{total} milestones)
                  </p>
                </div>

                {/* Milestones */}
                {c.milestones && c.milestones.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Milestones</h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {c.milestones.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center p-2 rounded-lg transition-all ${m.completed
                              ? 'bg-green-50 border border-green-100'
                              : 'bg-white border border-gray-100'
                            }`}
                        >
                          <span className={`mr-3 ${m.completed ? 'text-green-500' : 'text-gray-400'
                            }`}>
                            {m.completed ? <FaCheckCircle /> : '○'}
                          </span>
                          <span className={`text-sm ${m.completed ? 'text-green-700 line-through' : 'text-gray-900'
                            }`}>
                            {m.title || m.stage || `Milestone ${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/contract/${c._id}`}
                  className="inline-block w-full text-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyWork;