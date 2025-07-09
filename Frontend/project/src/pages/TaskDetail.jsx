import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MilestoneActions from '../pages/MilestoneActions';
import ContractCompletionButton from '../pages/ContractCompletionButton';
import OfferForm from '../pages/OfferForm';
import '../pages/TaskDetail.css';
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
  }, [taskId, navigate]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (loading) return <p className="text-white p-4">Loading task details...</p>;
  if (message) return <p className="text-red-400 p-4">{message}</p>;
  if (!task) return <p className="text-white p-4">No task data found.</p>;

  const currentUserId = localStorage.getItem('userId');
  const isTaskPoster = currentUserId === task.postedBy?._id;
  const hasUserAlreadyOffered = task.offers?.some(o => o.offeredBy?._id === currentUserId);
  const allMilestonesComplete = task.contract?.milestones?.every(m => m.completed);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-600/30">
          <h2 className="text-3xl font-semibold mb-2">{task.title}</h2>
          <p className="text-gray-300 mb-2">{task.description}</p>
          <p className="text-sm text-purple-400">Status: {task.status}</p>
          <p className="text-sm text-purple-400">Component: {task.componentType}</p>
          <p className="text-sm text-purple-400">Fee: ₹{task.participationFee}</p>
          <p className="text-sm text-purple-400">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <p className="text-sm text-gray-400 mt-2">Posted by: {task.postedBy?.name} ({task.postedBy?.email})</p>
        </div>

        {task.status === 'open' && !isTaskPoster && !hasUserAlreadyOffered && (
          <div className="offer-section">
            <h3 className="section-title">Apply for this Task</h3>
            <OfferForm taskId={task._id} />
            <p className="section-note">* You can only apply if the task is open and you haven't made an offer yet.</p>
          </div>

        )}

        {(isTaskPoster || hasUserAlreadyOffered) && (
          <div className="bg-gray-800 p-5 rounded-lg border border-purple-500/30">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">Offers {isTaskPoster ? 'Received' : 'You Applied'}</h3>
            {task.offers && task.offers.length > 0 ? (
              <ul className="space-y-4">
                {task.offers.map((offer) => (
                  <li
                    key={offer._id}
                    className={`p-4 rounded-lg border ${
                      offer.offeredBy?._id === currentUserId
                        ? 'bg-blue-900/40 border-blue-500'
                        : 'bg-gray-900 border-gray-700'
                    }`}
                  >
                    <p className="text-sm">Offered By: {offer.offeredBy?.name}</p>
                    <p className="text-sm">Proposed Fee: ₹{offer.proposedFee}</p>
                    <p className="text-sm">Message: {offer.message}</p>
                    <p className="text-sm text-gray-300">Status: {offer.status || 'Pending'}</p>

                    {isTaskPoster && task.status === 'open' && offer.status === 'pending' && (
                      <button
                        onClick={() => navigate(`/tasks/${task._id}/offers`)}
                        className="mt-3 bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded"
                      >
                        Go to Accept Offer
                      </button>
                    )}

                    {hasUserAlreadyOffered &&
                      offer.offeredBy?._id === currentUserId &&
                      offer.status === 'pending' && (
                        <p className="text-sm text-blue-400 mt-1">Your offer is pending review.</p>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No offers yet for this task.</p>
            )}
          </div>
        )}

        {task.contract ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-blue-600/40">
            <h3 className="text-xl font-bold text-blue-300 mb-3">Contract Details</h3>
            <p>Contract ID: {task.contract._id}</p>
            <p>Payment Terms: {task.contract.paymentTerms}</p>
            <p>Status: {task.contract.status}</p>
            <p>Accepted Fee: ₹{task.contract.acceptedOffer?.proposedFee}</p>
            <p>
              Implementer: {task.contract.acceptedOffer?.offeredBy?.name} (
              {task.contract.acceptedOffer?.offeredBy?.email})
            </p>

            <MilestoneActions
              contractId={task.contract._id}
              milestones={task.contract.milestones}
              taskPosterId={task.postedBy._id}
              refreshTask={fetchTask}
            />

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
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Raise Dispute
              </button>
            )}
          </div>
        ) : (
          isTaskPoster &&
          task.status === 'open' && (
            <p className="text-gray-400">No contract yet. Accept an offer to create one.</p>
          )
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
