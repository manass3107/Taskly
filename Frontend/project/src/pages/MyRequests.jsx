import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClipboardList, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

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

  // The previous "Access denied" message block has been removed as per instruction.
  // For non-worker roles, the component will now proceed to render,
  // but the requests array will remain empty as fetchRequests is not called.

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Milestone Requests</h1>
        <p className="text-gray-600">Track status of your submitted milestone requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex items-center justify-center mt-16">
          <div className="bg-blue-50 text-blue-600 border border-blue-100 rounded-xl px-8 py-6 text-center">
            <FaClipboardList className="mx-auto text-3xl mb-2" />
            <p>No milestone requests submitted yet.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Task</p>
                  <p className="text-gray-900 font-semibold text-lg">{req.taskTitle}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Milestone</p>
                  <p className="text-gray-900 font-medium">{req.stage}</p>
                  {req.description && (
                    <p className="text-gray-600 text-sm mt-1">{req.description}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full text-sm ${req.status?.toLowerCase() === 'approved'
                    ? 'bg-green-100 text-green-700' :
                    req.status?.toLowerCase() === 'pending'
                      ? 'bg-yellow-100 text-yellow-700' :
                      req.status?.toLowerCase() === 'rejected'
                        ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {req.status?.toLowerCase() === 'approved' && <FaCheckCircle />}
                    {req.status?.toLowerCase() === 'pending' && <FaClock />}
                    {req.status?.toLowerCase() === 'rejected' && <FaTimesCircle />}
                    {req.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;