import React, { useState, useEffect } from 'react';
import { api } from '../../helper/apiHelper';
import FabricList from '../comman/list/FabricList';
import { confirmAlert } from 'react-confirm-alert';

const BuyerFabricList = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await api.get('/buyers/fabrics');
        setFabrics(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFabrics();
  }, []);

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this fabric?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/buyers/fabrics/${id}`);
              setFabrics(fabrics.filter(fabric => fabric._id !== id));
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
      viewType="buyer"
      onDelete={handleDelete}
      showAddButton={true}
    />
  );
};

export default BuyerFabricList;