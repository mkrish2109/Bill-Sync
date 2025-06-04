import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import { useSelector } from 'react-redux';
import { FaBox } from 'react-icons/fa';
import Dashboard from '../dashboard/Dashboard';
import FabricCard from './fabric/FabricCard';
import { getUserRequests } from '../../services/api';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fabricsResponse, requestsResponse] = await Promise.all([
          api.get(`/buyers/fabrics`),
          getUserRequests()
        ]);
        
        setFabrics(fabricsResponse.data.data);
        
        // Process request status data
        const { sentRequests, receivedRequests } = requestsResponse.data.data;
        const allRequests = [...sentRequests, ...receivedRequests];
        const statusCounts = allRequests.reduce((acc, request) => {
          acc[request.status] = (acc[request.status] || 0) + 1;
          acc.total = (acc.total || 0) + 1;
          return acc;
        }, { pending: 0, accepted: 0, rejected: 0, total: 0 });
        
        setRequestStatus(statusCounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
      userRequests={requestStatus}
    />
  );
};

export default BuyerDashboard;