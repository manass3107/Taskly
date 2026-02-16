import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-6 py-4 text-center">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            My Posted Contracts
          </h2>
          <p className="text-gray-600">Manage contracts for tasks you've posted</p>
        </div>

        {contracts.length === 0 ? (
          <div className="flex items-center justify-center mt-16">
            <div className="bg-blue-50 text-blue-600 border border-blue-100 rounded-xl px-8 py-6 text-center">
              <p className="text-lg">No active contracts found.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((c) => {
              const status = c?.status?.toLowerCase?.() || 'unknown';
              return (
                <div key={c._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Task</p>
                      <p className="text-lg font-semibold text-gray-900">{c.taskTitle || 'Untitled'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Worker</p>
                      <p className="text-lg font-medium text-gray-900">{c.workerName || 'Unknown'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${status === 'active'
                          ? 'bg-green-100 text-green-700' :
                          status === 'completed'
                            ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {c.status || 'Unknown'}
                      </span>
                    </div>

                    <div className="pt-4">
                      <Link
                        to={`/contract/${c._id}`}
                        className="inline-block w-full text-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        Manage Contract
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPostedContracts;