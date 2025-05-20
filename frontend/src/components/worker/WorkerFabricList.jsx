import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../helper/apiHelper';
import FabricList from '../comman/list/FabricList';
import { confirmAlert } from 'react-confirm-alert';

const WorkerFabricList = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchWorkerFabrics = async () => {
      try {
        const response = await api.get('/workers/fabrics');
        const filteredFabrics = statusFilter === 'all' 
          ? response.data.data 
          : response.data.data.filter(fabric => fabric.assignmentStatus === statusFilter);
        
        setFabrics(filteredFabrics);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

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
              await api.put(`/workers/update-status/${assignmentId}`, { status: newStatus });
              setFabrics(fabrics.map(fabric => {
                if (fabric._id === fabricId) {
                  return { ...fabric, assignmentStatus: newStatus };
                }
                return fabric;
              }));
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