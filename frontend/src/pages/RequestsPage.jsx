import React, { useEffect, useCallback, useRef } from 'react';
import { useRequests } from '../hooks/useRequests';
import RequestTabs from '../components/RequestTabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/Alert';
import { useSocket } from '../contexts/SocketContext';

const RequestsPage = () => {
  const userType = localStorage.getItem('role')?.toLowerCase();
  const { requests, loading, error, acceptRequest, rejectRequest, refetchRequests } = useRequests(userType);
  const { socket, isConnected } = useSocket();
  const listenersSetRef = useRef(false);

  const handleNewRequest = useCallback((data) => {
    refetchRequests();
  }, [refetchRequests]);

  const handleRequestStatusUpdate = useCallback((data) => {
    refetchRequests();
  }, [refetchRequests]);

  useEffect(() => {
    if (!socket || !isConnected) {
      console.warn('Socket not available or not connected in RequestsPage');
      return;
    }

    if (listenersSetRef.current) {
      return;
    }
    
    // Listen for new requests and status updates
    socket.on('new_request', handleNewRequest);
    socket.on('request_status_update', handleRequestStatusUpdate);
    listenersSetRef.current = true;

    // Cleanup function
    return () => {
      if (socket && listenersSetRef.current) {
        socket.off('new_request', handleNewRequest);
        socket.off('request_status_update', handleRequestStatusUpdate);
        listenersSetRef.current = false;
      }
    };
  }, [socket, isConnected, handleNewRequest, handleRequestStatusUpdate]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptRequest(requestId);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectRequest(requestId);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  // Filter requests based on user type
  const filteredRequests = {
    sent: userType === 'buyer' ? requests.sent : [],
    received: userType === 'worker' ? requests.received : []
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  } 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {userType === 'buyer' ? 'Sent Requests' : 'Received Requests'}
      </h1>
      <RequestTabs
        userType={userType}
        sentRequests={filteredRequests.sent}
        receivedRequests={filteredRequests.received}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </div>
  );
};

export default RequestsPage;