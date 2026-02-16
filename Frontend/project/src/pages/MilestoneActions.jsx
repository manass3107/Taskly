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
      {/* Messages */}
      {message && (
        <div className="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl">
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
              className={`bg-gray-50 rounded-xl border transition-all duration-300 ${milestone.completed
                  ? 'border-green-200 bg-green-50'
                  : milestone.completionRequested
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">

                  {/* Milestone Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${milestone.completed
                          ? 'bg-green-600'
                          : milestone.completionRequested
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
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
                        <h5 className="text-lg font-semibold text-gray-900">
                          {milestone.stage}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {milestone.completed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                      {milestone.completionRequested && !milestone.completed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all flex items-center whitespace-nowrap"
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
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-all flex items-center whitespace-nowrap"
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
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Milestones Defined</h3>
          <p className="text-gray-600">This contract doesn't have any milestones set up yet.</p>
        </div>
      )}
    </div>
  );
};

export default MilestoneActions;