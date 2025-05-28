import { useState, useEffect } from 'react';
import {
  getAvailableWorkers,
  sendRequest,
  acceptRequest,
  rejectRequest,
  getUserRequests
} from '../services/api';

// Hook for handling requests (sent/received)
export const useRequests = (userType) => {
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserRequests();
      
      if (response?.data?.success) {
        const { sentRequests = [], receivedRequests = [] } = response.data.data || {};
        setRequests({
          sent: sentRequests || [],
          received: receivedRequests || []
        });
      } else {
        const errorMsg = response?.data?.message || 'Failed to fetch requests';
        setError(errorMsg);
        setRequests({ sent: [], received: [] });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
      setRequests({ sent: [], received: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    // Only workers can accept requests
    if (userType !== 'worker') {
      setError('Only workers can accept requests');
      return;
    }

    try {
      setError(null);
      const response = await acceptRequest(requestId);
      
      if (response?.data?.success) {
        // Refresh requests after accepting
        await fetchUserRequests();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || 'Failed to accept request';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
      throw err;
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Only workers can reject requests
    if (userType !== 'worker') {
      setError('Only workers can reject requests');
      return;
    }

    try {
      setError(null);
      const response = await rejectRequest(requestId);
      
      if (response?.data?.success) {
        // Refresh requests after rejecting
        await fetchUserRequests();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || 'Failed to reject request';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
      throw err;
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [userType]);

  return {
    requests,
    loading,
    error,
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
    refetchRequests: fetchUserRequests
  };
};

// Separate hook for handling available workers (used in Network page)
export const useAvailableWorkers = () => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAvailableWorkers();
      
      if (response?.data?.success) {
        // Extract the workers array from the nested data structure
        const workers = response.data.data?.data || [];
        setAvailableUsers(workers);
      } else {
        setError(response?.data?.message || 'Failed to fetch available workers');
        setAvailableUsers([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available workers');
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId, message) => {
    try {
      setError(null);
      const response = await sendRequest({
        senderId: localStorage.getItem('userId'),
        receiverId,
        message
      });
      
      if (response?.data?.success) {
        // Refresh available users after sending request
        await fetchAvailableUsers();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || 'Failed to send request';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
      throw err;
    }
  };

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  return {
    availableUsers,
    loading,
    error,
    sendRequest: handleSendRequest,
    refetchUsers: fetchAvailableUsers
  };
};