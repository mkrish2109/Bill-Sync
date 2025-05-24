import React, { useState, useEffect } from 'react';
import { api } from '../../helper/apiHelper';
import { confirmAlert } from 'react-confirm-alert';
import { FabricList } from '../fabrics/FabricList';

const BuyerFabricList = () => {
  const [fabricData, setFabricData] = useState({
    fabrics: [],
    loading: true,
    error: null
  });

  const fetchFabrics = async () => {
    try {
      setFabricData(prev => ({ ...prev, loading: true }));
      const response = await api.get('/buyers/fabrics');
      
      const flattenedData = response.data.data.map(item => ({
        ...item.fabric,
        buyer: item.buyer,
        worker: item.worker || null,
        assignmentCount: item.assignmentCount
      }));

      setFabricData({
        fabrics: flattenedData,
        loading: false,
        error: null
      });
    } catch (err) {
      setFabricData({
        fabrics: [],
        loading: false,
        error: err.message
      });
    }
  };

  useEffect(() => {
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
              setFabricData(prev => ({
                ...prev,
                fabrics: prev.fabrics.filter(fabric => fabric._id !== id)
              }));
            } catch (err) {
              setFabricData(prev => ({
                ...prev,
                error: err.message
              }));
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleFabricUpdate = (updatedFabric) => {
    setFabricData(prev => ({
      ...prev,
      fabrics: prev.fabrics.map(fabric => 
        fabric._id === updatedFabric._id ? {
          ...fabric,
          ...updatedFabric,
          worker: updatedFabric.worker !== undefined ? updatedFabric.worker : fabric.worker
        } : fabric
      )
    }));
  };

  return (
    <FabricList
      fabrics={fabricData.fabrics}
      loading={fabricData.loading}
      error={fabricData.error}
      viewType="buyer"
      onDelete={handleDelete}
      onUpdate={handleFabricUpdate}
      showAddButton={true}
    />
  );
};

export default BuyerFabricList;