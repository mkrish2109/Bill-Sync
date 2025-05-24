import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import { useSelector } from 'react-redux';
import { FaBox } from 'react-icons/fa';
import Dashboard from '../dashboard/Dashboard';
import FabricCard from './fabric/FabricCard';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/buyers/fabrics`);
        setFabrics(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFabrics();
  }, [user._id]);

  // Transform fabrics to include status at root level for the dashboard
  const transformedFabrics = fabrics.map(item => ({
    ...item,
    status: item.assignments?.status || 'unassigned'
  }));

  return (
    <Dashboard
      title="My Fabric Dashboard"
      items={transformedFabrics}
      loading={loading}
      error={error}
      setError={setError}
      itemType="fabrics"
      statusKey="status"
      searchKeys={['fabric.name', 'fabric.referenceNumber']}
      emptyStateIcon={FaBox}
      renderCard={(item) => (
        <FabricCard 
          key={item.fabric._id}
          fabric={item}
          onClick={() => navigate(`/buyer/fabrics/${item.fabric._id}`)}
        />
      )}
      onAddNew={() => navigate('/buyer/fabrics/new')}
      addNewLabel="Add New Fabric"
    />
  );
};

export default BuyerDashboard;