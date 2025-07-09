import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MilestoneActions from './MilestoneActions';
import './ContractDetails.css'; // 👈 Import the custom CSS
const API_BASE = process.env.REACT_APP_API || "http://localhost:5000";

function ContractDetails() {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');

  const fetchContract = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/contracts/view/${contractId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch contract');
      }
      const data = await res.json();
      setContract(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  if (error) return <p className="error-msg">{error}</p>;
  if (!contract) return <p className="loading-msg">Loading contract details...</p>;

  return (
    <div className="contract-details-container">
      <h2 className="title">📄 Contract Details</h2>

      <div className="card">
        <p><strong>📝 Task Title:</strong> {contract.taskId.title}</p>
        <p><strong>📌 Status:</strong> {contract.status}</p>
        <p><strong>👤 Assigned To:</strong> {contract.acceptedOffer.offeredBy.name}</p>
        <p><strong>💰 Payment:</strong> ₹{contract.acceptedOffer.amount}</p>
        <p><strong>🗓️ Deadline:</strong> {new Date(contract.deadline).toLocaleDateString()}</p>
      </div>

      <div className="milestone-section">
        <h3 className="section-title">🚧 Milestones</h3>
        <MilestoneActions
          contractId={contract._id}
          milestones={contract.milestones}
          taskPosterId={contract.taskId.postedBy._id}
          refreshTask={fetchContract}
        />
      </div>
    </div>
  );
}

export default ContractDetails;
