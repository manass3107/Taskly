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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl px-6 py-4 text-center">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Posted Contracts
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {contracts.length === 0 ? (
          <div className="flex items-center justify-center mt-16">
            <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl px-8 py-6 text-center">
              <p className="text-lg">No active contracts found.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((c) => {
              const status = c?.status?.toLowerCase?.() || 'unknown';
              return (
                <div key={c._id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg">
                        <span className="font-semibold text-purple-300">Task:</span>{' '}
                        <span className="text-white">{c.taskTitle || 'Untitled'}</span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-lg">
                        <span className="font-semibold text-purple-300">Worker:</span>{' '}
                        <span className="text-white">{c.workerName || 'Unknown'}</span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-lg">
                        <span className="font-semibold text-purple-300">Status:</span>{' '}
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          status === 'active' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          status === 'completed' 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {c.status || 'Unknown'}
                        </span>
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Link 
                        to={`/contract/${c._id}`} 
                        className="inline-block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                      >
                        Manage
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