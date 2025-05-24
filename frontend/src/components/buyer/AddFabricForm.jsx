import React, { useEffect, useState } from 'react';
import { api } from '../../helper/apiHelper';
import FabricForm from '../fabrics/FabricForm';

const AddFabricForm = () => {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workersResponse = await api.get('/workers/all');
        setWorkers(workersResponse.data.data);
      } catch (err) {
        setError('Failed to fetch workers');
      }
    };
    fetchWorkers();
  }, []);

  return (
    <>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <FabricForm 
        workers={workers}
        onSuccessRedirect="/buyer/fabrics"
        onCancelRedirect='/buyer/fabrics'
      />
    </>
  );
};

export default AddFabricForm;