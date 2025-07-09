import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
const userRole = localStorage.getItem('userRole');

useEffect(() => {
  if (userRole !== 'worker') {
    return; // only workers should access this
  }

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/contracts/my-milestone-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching milestone requests:', err);
    }
  };

  fetchRequests();
}, [userRole]);


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Milestone Requests</h2>
      {requests.length === 0 ? (
        <p>No milestone requests submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req, idx) => (
            <div key={idx} className="border p-3 rounded shadow">
              <p><strong>Task:</strong> {req.taskTitle}</p>
              <p><strong>Milestone:</strong> {req.stage} - {req.description}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
