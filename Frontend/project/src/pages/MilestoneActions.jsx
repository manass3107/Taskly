import React, { useState } from 'react';
import './MilestoneActions.css'; 
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

      setMessage(`✅ Milestone "${milestones[milestoneIndex].description}" completion requested.`);
      refreshTask();

    } catch (err) {
      console.error('Error requesting milestone completion:', err);
      setError(`❌ ${err.message}`);
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

      setMessage(`✅ Milestone "${milestones[milestoneIndex].description}" approved and paid.`);
      refreshTask();

    } catch (err) {
      console.error('Error approving milestone:', err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="milestone-box">
      <h4 className="milestone-title">🚧 Milestones</h4>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      {milestones && milestones.length > 0 ? (
        <ul className="milestone-list">
          {milestones.map((milestone, index) => (
            <li key={index} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
              <div className="milestone-info">
                <strong>{milestone.stage}</strong>: {milestone.description}
                {milestone.completed && <span className="badge done">✔ Completed</span>}
                {milestone.completionRequested && !milestone.completed && (
                  <span className="badge pending">⏳ Pending Approval</span>
                )}
              </div>
              <div className="milestone-buttons">
                {!milestone.completed && !isTaskPoster && !milestone.completionRequested && (
                  <button onClick={() => handleRequestMilestoneCompletion(index)} className="btn btn-request">
                    Request Completion
                  </button>
                )}
                {!milestone.completed && isTaskPoster && milestone.completionRequested && (
                  <button onClick={() => handleMarkMilestoneComplete(index)} className="btn btn-approve">
                    Approve & Pay
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-milestone-text">No milestones defined for this contract.</p>
      )}
    </div>
  );
};

export default MilestoneActions;
