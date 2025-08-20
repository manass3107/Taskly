import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/MyPostedContracts.css';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function MyPostedContracts() {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/contracts/my-posted-contracts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch posted contracts');
        }

        const data = await res.json();
        setContracts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchContracts();
  }, []);

  if (error) return <p className="text-red-500 text-center mt-4">Error: {error}</p>;

  return (
    <div className="contracts-wrapper">
      <h2 className="contracts-title">My Posted Contracts</h2>

      {contracts.length === 0 ? (
        <p className="text-gray-400 text-center">No active contracts found.</p>
      ) : (
        contracts.map((c) => {
          const status = c?.status?.toLowerCase?.() || 'unknown';
          return (
            <div key={c._id} className="contract-card">
              <p><span className="contract-label">Task:</span> <span className="contract-value">{c.taskTitle || 'Untitled'}</span></p>
              <p><span className="contract-label">Worker:</span> <span className="contract-value">{c.workerName || 'Unknown'}</span></p>
              <p>
                <span className="contract-label">Status:</span>{' '}
                <span className={`contract-status ${
                  status === 'active' ? 'status-active' :
                  status === 'completed' ? 'status-completed' :
                  'status-pending'
                }`}>
                  {c.status || 'Unknown'}
                </span>
              </p>
              <Link to={`/contract/${c._id}`} className="manage-link">Manage</Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyPostedContracts;
