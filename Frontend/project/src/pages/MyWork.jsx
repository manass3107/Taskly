import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/MyWork.css'; 
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
    <div className="mywork-container">
      <h2 className="mywork-title">📁 My Ongoing Work</h2>
      {contracts.length === 0 ? (
        <p className="no-contracts">No ongoing work found.</p>
      ) : (
        contracts.map((c) => {
          const total = c.milestones?.length || 0;
          const completed = c.milestones?.filter((m) => m.completed).length || 0;
          const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

          return (
            <div key={c._id} className="contract-card">
              <div className="contract-header">
                <h3 className="contract-title">{c.taskTitle}</h3>
                <span className={`contract-status ${c.status ? c.status.toLowerCase() : 'unknown'}`}>
                  {c.status || 'Unknown'}
                </span>

              </div>
              {c.deadline && (
                <p className="contract-deadline">📅 Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
              )}

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="progress-label">{progressPercent}% complete</p>

              {c.milestones && c.milestones.length > 0 && (
                <ul className="milestone-list">
                  {c.milestones.map((m, idx) => (
                    <li key={idx} className={m.completed ? 'milestone done' : 'milestone'}>
                      {m.title}
                    </li>
                  ))}
                </ul>
              )}

              <Link to={`/contract/${c._id}`} className="manage-btn">View Details</Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyWork;
