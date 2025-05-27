import React from 'react';
import { useRequests } from '../hooks/useRequests';
import RequestTabs from '../components/RequestTabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/Alert';

const RequestsPage = () => {
  const userType = localStorage.getItem('role')?.toLowerCase();
  const { requests, loading, error, acceptRequest, rejectRequest } = useRequests(userType);

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
        onAccept={acceptRequest}
        onReject={rejectRequest}
      />
    </div>
  );
};

export default RequestsPage;