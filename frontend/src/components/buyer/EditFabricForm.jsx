import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import FabricForm from '../fabrics/FabricForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { ErrorAlert } from '../common/Alert';

const EditFabricForm = ({ fabricId, onClose, onSuccess }) => {
  const { id } = useParams();
  const [workers, setWorkers] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        // Fetch fabric data
        const fabricResponse = await api.get(`/fabrics/test/${fabricId || id}`);
        const fabric = fabricResponse.data.data;

        // Fetch connected workers
        const workersResponse = await api.get('/requests/connections');
        if (workersResponse.data.success) {
          const connectedWorkers = workersResponse.data.data.connections.map(
            connection => connection.user
          );
          setWorkers(connectedWorkers);
        }

        // Get the first assigned worker ID if exists
        const workerId = fabric.worker?.[0]?.id || '';

        // Set initial data for form
        setInitialData({
          name: fabric.name,
          description: fabric.description,
          unit: fabric.unit,
          quantity: fabric.quantity,
          unitPrice: fabric.unitPrice,
          imageUrl: fabric.imageUrl,
          workerId: workerId
        });

        // Set current assignment with worker details
        const assignment = fabric.assignments?.[0];
        if (assignment) {
          setCurrentAssignment({
            ...assignment,
            worker: fabric?.worker?.[0]
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [fabricId, id]);

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl bg-surface-light dark:bg-surface-dark">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (workers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No connected workers found.</p>
        <p className="text-sm text-gray-500">
          You need to connect with workers before editing fabrics.
          <a 
            href="/buyer/network" 
            className="text-blue-500 hover:text-blue-600 ml-1"
          >
            Find workers
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentAssignment && (
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6 p-4 bg-surface-elevatedLight dark:bg-surface-elevatedDark rounded-lg shadow-card dark:shadow-card-dark">
            <h3 className="font-bold text-lg text-text-light dark:text-text-dark mb-3">
              Current Assignment
            </h3>
            <div className="text-sm flex gap-2 items-center text-text-secondaryLight dark:text-text-secondaryDark">
              <div className="font-medium">Assigned Worker:</div>
              <div className="flex gap-2 items-center">
                {currentAssignment.worker?.name || 'Unknown worker'} 
                <StatusBadge status={currentAssignment.status} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <FabricForm 
        initialData={initialData}
        isEditing={true}
        fabricId={fabricId}
        workers={workers}
        onSuccessRedirect="/buyer/fabrics"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default EditFabricForm;