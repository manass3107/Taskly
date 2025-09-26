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

  if (userRole !== 'worker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl px-8 py-6 text-center">
          <p className="text-lg">Access denied. Worker role required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Milestone Requests
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {requests.length === 0 ? (
          <div className="flex items-center justify-center mt-16">
            <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl px-8 py-6 text-center">
              <p className="text-lg">No milestone requests submitted yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req, idx) => (
              <div 
                key={idx} 
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xl">
                      <strong className="text-purple-300">Task:</strong>{' '}
                      <span className="text-white">{req.taskTitle}</span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xl">
                      <strong className="text-purple-300">Milestone:</strong>{' '}
                      <span className="text-white">{req.stage}</span>
                      {req.description && (
                        <span className="text-purple-200"> - {req.description}</span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xl">
                      <strong className="text-purple-300">Status:</strong>{' '}
                      <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        req.status?.toLowerCase() === 'approved' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        req.status?.toLowerCase() === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        req.status?.toLowerCase() === 'rejected' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;