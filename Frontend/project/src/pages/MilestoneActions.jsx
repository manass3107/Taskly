import React, { useState } from 'react';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const MilestoneActions = ({ contractId, milestones, taskPosterId, refreshTask }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const isTaskPoster = currentUserId === taskPosterId;

  const token = localStorage.getItem('token');

  const handleRequestMilestoneCompletion = async (milestoneIndex) => {
    if (!token) {
      setError('You must be logged in to request milestone completion.');
      return;
    }

    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/contracts/${contractId}/milestones/${milestoneIndex}/request-completion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request milestone completion');
      }

      setMessage(`Milestone "${milestones[milestoneIndex].description}" completion requested.`);
      refreshTask();

    } catch (err) {
      console.error('Error requesting milestone completion:', err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleMarkMilestoneComplete = async (milestoneIndex) => {
    if (!token) {
      setError('You must be logged in to mark a milestone complete.');
      return;
    }

    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/contracts/${contractId}/milestones/${milestoneIndex}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve milestone');
      }

      setMessage(`Milestone "${milestones[milestoneIndex].description}" approved and paid.`);
      refreshTask();

    } catch (err) {
      console.error('Error approving milestone:', err);
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h4 className="text-2xl font-bold text-white">Project Milestones</h4>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-100 px-6 py-4 rounded-xl backdrop-blur-sm animate-slide-down">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-6 py-4 rounded-xl backdrop-blur-sm animate-slide-down">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Milestones List */}
      {milestones && milestones.length > 0 ? (
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                milestone.completed
                  ? 'border-green-500/30 bg-green-500/10'
                  : milestone.completionRequested
                  ? 'border-yellow-500/30 bg-yellow-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  
                  {/* Milestone Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        milestone.completed
                          ? 'bg-green-500'
                          : milestone.completionRequested
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}>
                        {milestone.completed ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : milestone.completionRequested ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                          </svg>
                        ) : (
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="text-lg font-semibold text-white">
                          {milestone.stage}
                        </h5>
                        <p className="text-purple-200 text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {milestone.completed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                      {milestone.completionRequested && !milestone.completed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                          </svg>
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-6 flex flex-col gap-2">
                    {!milestone.completed && !isTaskPoster && !milestone.completionRequested && (
                      <button
                        onClick={() => handleRequestMilestoneCompletion(index)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Request Completion
                      </button>
                    )}
                    {!milestone.completed && isTaskPoster && milestone.completionRequested && (
                      <button
                        onClick={() => handleMarkMilestoneComplete(index)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve & Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center opacity-50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Milestones Defined</h3>
          <p className="text-purple-300">This contract doesn't have any milestones set up yet.</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MilestoneActions;