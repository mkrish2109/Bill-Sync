// WorkerDashboard.jsx (frontend)
import { useState, useEffect } from 'react';
import { api } from '../helper/apiHelper';

export default function WorkerDashboard() {
  const [assignedFabrics, setAssignedFabrics] = useState([]);

  useEffect(() => {
    const fetchAssignedFabrics = async () => {
      try {
        const response = await api.get('/worker/assigned-fabrics');
        setAssignedFabrics(response.data);
      } catch (error) {
        console.error('Error fetching assigned fabrics', error);
      }
    };
    fetchAssignedFabrics();
  }, []);

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      await api.put(`/worker/update-status/${assignmentId}`, { status: newStatus });
      setAssignedFabrics((prev) =>
        prev.map((item) =>
          item._id === assignmentId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  return (
    <div>
      <h2>Worker Dashboard</h2>
      <ul>
        {assignedFabrics.map((assignment) => (
          <li key={assignment._id}>
            Fabric ID: {assignment.fabricId}, Status: {assignment.status}
            {assignment.status === 'assigned' && (
              <button onClick={() => handleStatusUpdate(assignment._id, 'in-progress')}>
                Mark as In Progress
              </button>
            )}
            {assignment.status === 'in-progress' && (
              <button onClick={() => handleStatusUpdate(assignment._id, 'completed')}>
                Mark as Completed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
