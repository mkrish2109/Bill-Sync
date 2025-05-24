import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../helper/apiHelper';
import { confirmAlert } from 'react-confirm-alert';
import { FabricList } from '../fabrics/FabricList';

const WorkerFabricList = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useSelector((state) => state.user);

  const fetchWorkerFabrics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/workers/fabrics');
      const allFabrics = response.data.data.map(item => ({
        ...item.fabric,
        buyer: item.buyer,
        worker: item.worker,
        assignmentStatus: item.assignmentStatus,
        assignmentId: item.assignmentId,
        assignedAt: item.assignedAt,
      }));
      const filteredFabrics = statusFilter === 'all'
        ? allFabrics
        : allFabrics.filter(fabric => fabric.assignmentStatus === statusFilter);

      setFabrics(filteredFabrics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerFabrics();
  }, [statusFilter]);

  const handleStatusUpdate = async (fabricId, assignmentId, newStatus) => {
    confirmAlert({
      title: 'Confirm status change',
      message: `Are you sure you want to change status to ${newStatus}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.put(`/assignments/update-status/${assignmentId}`, { status: newStatus });
              // Reload the data after status update
              await fetchWorkerFabrics();
            } catch (err) {
              setError(err.message);
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  return (
    <FabricList
      fabrics={fabrics}
      loading={loading}
      error={error}
      viewType="worker"
      onStatusChange={handleStatusUpdate}
      onFilterChange={setStatusFilter}
      statusFilter={statusFilter}
    />
  );
};

export default WorkerFabricList;