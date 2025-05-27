import React, { useEffect, useState } from 'react';
import { api } from '../../helper/apiHelper';
import FabricForm from '../fabrics/FabricForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { ErrorAlert } from '../common/Alert';

const AddFabricForm = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConnectedWorkers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/requests/connections');
        if (response.data.success) {
          // Extract workers from connections data
          const connectedWorkers = response.data.data.connections.map(
            connection => connection.user
          );
          setWorkers(connectedWorkers);
        }
      } catch (err) {
        setError('Failed to fetch connected workers');
      } finally {
        setLoading(false);
      }
    };
    fetchConnectedWorkers();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (workers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No connected workers found.</p>
        <p className="text-sm text-gray-500">
          You need to connect with workers before adding fabrics.
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
    <FabricForm 
      workers={workers}
      onSuccessRedirect="/buyer/fabrics"
      onCancelRedirect='/buyer/fabrics'
    />
  );
};

export default AddFabricForm;