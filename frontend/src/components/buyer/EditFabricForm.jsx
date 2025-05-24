import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import FabricForm from '../fabrics/FabricForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';

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
        // Fetch fabric data
        const fabricResponse = await api.get(`/fabrics/test/${fabricId || id}`);
        const fabric = fabricResponse.data.data;

        // Fetch workers
        const workersResponse = await api.get('/workers/all');
        setWorkers(workersResponse.data.data);

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
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to fetch fabric data');
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [fabricId]);

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl bg-surface-light dark:bg-surface-dark">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-base/10 border border-error-base text-error-base px-4 py-3 rounded mb-4">
        {error}
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