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
  }, [taskId, navigate]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 font-medium">Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error/Message State
  if (message) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-6 text-center max-w-md">
              <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Task Found</h3>
              <p className="text-gray-600">The requested task could not be found.</p>
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
      'open': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: '🟢' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '🔄' },
      'completed': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: '✅' },
      'closed': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: '❌' }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Details
          </h1>
          <p className="text-gray-600">View and manage task information</p>
        </div>

        <div className="space-y-8">
          {/* Main Task Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  {getStatusBadge(task.status)}
                  <span className="text-gray-600 text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {task.componentType}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{task.description}</p>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-gray-900 font-medium">Participation Fee</span>
                </div>
                <p className="text-2xl font-bold text-green-700">₹{task.participationFee}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-4m0 0V9a4 4 0 00-4 4v1a2 2 0 002 2h4a2 2 0 002-2v-1a4 4 0 00-4-4z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Deadline</span>
                </div>
                <p className="text-blue-700 font-semibold">{new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Posted By */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {task.postedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{task.postedBy?.name}</p>
                  <p className="text-gray-600 text-sm">{task.postedBy?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Section */}
          {task.status === 'open' && !isTaskPoster && !hasUserAlreadyOffered && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Apply for this Task
                </h3>
                <p className="text-gray-600">Submit your proposal to work on this task</p>
              </div>
              <OfferForm taskId={task._id} />
              <div className="mt-6 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl p-4 text-center">
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
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Offers {isTaskPoster ? 'Received' : 'You Applied'}
              </h3>

              {task.offers && task.offers.length > 0 ? (
                <div className="space-y-4">
                  {task.offers.map((offer, index) => (
                    <div
                      key={offer._id}
                      className={`bg-gray-50 rounded-xl p-6 border transition-all ${offer.offeredBy?._id === currentUserId
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200'
                        }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {offer.offeredBy?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{offer.offeredBy?.name}</p>
                            <p className="text-gray-600 text-sm">Freelancer</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{offer.proposedFee}</p>
                          <p className="text-gray-600 text-sm">Proposed Fee</p>
                        </div>
                      </div>

                      {offer.message && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-100">
                          <p className="text-gray-700">{offer.message}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${offer.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                          offer.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                          {offer.status || 'Pending'}
                        </span>

                        {isTaskPoster && task.status === 'open' && offer.status === 'pending' && (
                          <button
                            onClick={() => navigate(`/tasks/${task._id}/offers`)}
                            className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-full hover:shadow-lg transition-all"
                          >
                            Review Offer
                          </button>
                        )}

                        {hasUserAlreadyOffered && offer.offeredBy?._id === currentUserId && offer.status === 'pending' && (
                          <span className="text-blue-600 text-sm font-medium">Your offer is pending review</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">No offers yet for this task.</p>
                </div>
              )}
            </div>
          )}

          {/* Contract Section */}
          {task.contract ? (
            <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-sm">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Contract Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="text-gray-900 font-semibold mb-4">Contract Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract ID:</span>
                      <span className="text-gray-900 font-mono text-sm">{task.contract._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-gray-900 font-semibold">{task.contract.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Terms:</span>
                      <span className="text-gray-900">{task.contract.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-gray-900 font-semibold mb-4">Implementer Details</h4>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {task.contract.acceptedOffer?.offeredBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{task.contract.acceptedOffer?.offeredBy?.name}</p>
                      <p className="text-blue-600 text-sm">{task.contract.acceptedOffer?.offeredBy?.email}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <p className="text-green-600 text-sm">Accepted Fee</p>
                    <p className="text-2xl font-bold text-green-700">₹{task.contract.acceptedOffer?.proposedFee}</p>
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
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full hover:shadow-lg transition-all flex items-center"
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
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Contract Yet</h3>
                <p className="text-gray-600">Accept an offer to create a contract and start the project.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;