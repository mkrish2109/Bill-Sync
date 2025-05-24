// WorkerDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import { useSelector } from 'react-redux';
import { FaTasks } from 'react-icons/fa';
import Dashboard from '../dashboard/Dashboard';
import AssignmentCard from '../assignment/AssignmentCard';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/workers/fabrics?workerId=${user._id}`);
        setAssignments(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [user._id]);

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    if (!assignmentId || !newStatus) {
      setError('Invalid assignment ID or status');
      return;
    }
    try {
      await api.put(`/assignments/update-status/${assignmentId}`, { 
        status: newStatus});
      
      // Refresh assignments
      const response = await api.get(`/workers/fabrics?workerId=${user._id}`);
      setAssignments(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Transform assignments to include status at root level for the dashboard
  const transformedAssignments = assignments.map(item => ({
    ...item,
    status: item.assignmentStatus || 'unassigned'
  }));

  return (
    <Dashboard
      title="My Assignments"
      items={transformedAssignments}
      loading={loading}
      error={error}
      setError={setError}
      itemType="assignments"
      statusKey="status"
      searchKeys={['fabric.name', 'buyer.name', 'instructions']}
      emptyStateIcon={FaTasks}
      showAddButton={false}
      renderCard={(item) => (
        <AssignmentCard 
          key={item._id || item.assignmentId}
          assignment={item}
          onStatusUpdate={handleStatusUpdate}
          onClick={() => navigate(`/worker/fabrics/${item.fabric._id}`)}
        />
      )}
    />
  );
};

export default WorkerDashboard;