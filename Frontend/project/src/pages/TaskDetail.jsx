import React, { useEffect, useState, useCallback } from 'react';
import MilestoneActions from '../pages/MilestoneActions';
import { useParams, useNavigate } from 'react-router-dom';
import ContractCompletionButton from '../pages/ContractCompletionButton';
import OfferForm from '../pages/OfferForm';

const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (userId && userRole) {
      setCurrentUser({ _id: userId, role: userRole });
    }
  }, []);

  const fetchTask = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        setMessage('⚠️ Session expired. Please login again.');
        localStorage.clear();
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch task');
      setTask(data);
    } catch (err) {
      console.error('Error fetching task:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <p className="text-purple-200 font-medium">Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error/Message State
  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl p-6 text-center max-w-md">
              <div className="w-12 h-12 bg-red-500/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Task State
  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">No Task Found</h3>
              <p className="text-purple-200">The requested task could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUserId = localStorage.getItem('userId');
  const isTaskPoster = currentUserId === task.postedBy?._id;
  const hasUserAlreadyOffered = task.offers?.some(o => o.offeredBy?._id === currentUserId);
  const allMilestonesComplete = task.contract?.milestones?.every(m => m.completed);

  // Task status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', icon: '🟢' },
      'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', icon: '🔄' },
      'completed': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', icon: '✅' },
      'closed': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', icon: '❌' }
    };
    const config = statusConfig[status] || statusConfig['open'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <span className="mr-2">{config.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Task Details
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {/* Main Task Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4">{task.title}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  {getStatusBadge(task.status)}
                  <span className="text-purple-300 text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {task.componentType}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-purple-200 mb-6 leading-relaxed">{task.description}</p>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/20 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-white font-medium">Participation Fee</span>
                </div>
                <p className="text-2xl font-bold text-green-300">₹{task.participationFee}</p>
              </div>

              <div className="bg-black/20 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-4m0 0V9a4 4 0 00-4 4v1a2 2 0 002 2h4a2 2 0 002-2v-1a4 4 0 00-4-4z" />
                  </svg>
                  <span className="text-white font-medium">Deadline</span>
                </div>
                <p className="text-purple-300 font-semibold">{new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Posted By */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {task.postedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{task.postedBy?.name}</p>
                  <p className="text-purple-300 text-sm">{task.postedBy?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Section */}
          {task.status === 'open' && !isTaskPoster && !hasUserAlreadyOffered && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Apply for this Task
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
              </div>
              <OfferForm taskId={task._id} />
              <div className="mt-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl p-4 text-center">
                <p className="text-sm">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You can only apply if the task is open and you haven't made an offer yet.
                </p>
              </div>
            </div>
          )}

          {/* Offers Section */}
          {(isTaskPoster || hasUserAlreadyOffered) && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Offers {isTaskPoster ? 'Received' : 'You Applied'}
              </h3>
              
              {task.offers && task.offers.length > 0 ? (
                <div className="space-y-4">
                  {task.offers.map((offer, index) => (
                    <div
                      key={offer._id}
                      className={`bg-black/20 rounded-xl p-6 border transition-all duration-300 ${
                        offer.offeredBy?._id === currentUserId
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : 'border-white/20 hover:border-purple-500/30'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {offer.offeredBy?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{offer.offeredBy?.name}</p>
                            <p className="text-purple-300 text-sm">Freelancer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-300">₹{offer.proposedFee}</p>
                          <p className="text-purple-300 text-sm">Proposed Fee</p>
                        </div>
                      </div>

                      {offer.message && (
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                          <p className="text-purple-200">{offer.message}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          offer.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          offer.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {offer.status || 'Pending'}
                        </span>

                        {isTaskPoster && task.status === 'open' && offer.status === 'pending' && (
                          <button
                            onClick={() => navigate(`/tasks/${task._id}/offers`)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-medium py-2 px-6 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                          >
                            Review Offer
                          </button>
                        )}

                        {hasUserAlreadyOffered && offer.offeredBy?._id === currentUserId && offer.status === 'pending' && (
                          <span className="text-blue-400 text-sm font-medium">Your offer is pending review</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-purple-200">No offers yet for this task.</p>
                </div>
              )}
            </div>
          )}

          {/* Contract Section */}
          {task.contract ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-500/30 p-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Contract Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-black/20 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Contract Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Contract ID:</span>
                      <span className="text-white font-mono text-sm">{task.contract._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Status:</span>
                      <span className="text-white">{task.contract.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Payment Terms:</span>
                      <span className="text-white">{task.contract.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Implementer Details</h4>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {task.contract.acceptedOffer?.offeredBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{task.contract.acceptedOffer?.offeredBy?.name}</p>
                      <p className="text-blue-300 text-sm">{task.contract.acceptedOffer?.offeredBy?.email}</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-300 text-sm">Accepted Fee</p>
                    <p className="text-2xl font-bold text-green-300">₹{task.contract.acceptedOffer?.proposedFee}</p>
                  </div>
                </div>
              </div>

              <MilestoneActions
                contractId={task.contract._id}
                milestones={task.contract.milestones}
                taskPosterId={task.postedBy._id}
                refreshTask={fetchTask}
              />

              <div className="flex gap-4 mt-6">
                {task.contract.status !== 'completed' && (
                  <ContractCompletionButton
                    contractId={task.contract._id}
                    allMilestonesComplete={allMilestonesComplete}
                    taskPosterId={task.postedBy._id}
                    refreshTask={fetchTask}
                  />
                )}

                {task.contract.status !== 'completed' && task.contract.status !== 'disputed' && (
                  <button
                    onClick={() => alert('Dispute functionality to be implemented!')}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-medium py-3 px-6 rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Raise Dispute
                  </button>
                )}
              </div>
            </div>
          ) : (
            isTaskPoster && task.status === 'open' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No Contract Yet</h3>
                <p className="text-purple-200">Accept an offer to create a contract and start the project.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;