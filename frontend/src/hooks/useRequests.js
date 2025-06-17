import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAvailableWorkers,
  sendRequest,
  acceptRequest,
  rejectRequest,
  getUserRequests,
  cancelRequest,
} from "../services/apiServices";
import { toast } from "react-toastify";

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
        const { sentRequests = [], receivedRequests = [] } =
          response.data.data || {};
        setRequests({
          sent: sentRequests || [],
          received: receivedRequests || [],
        });
      } else {
        const errorMsg = response?.data?.message || "Failed to fetch requests";
        setError(errorMsg);
        toast.error(errorMsg);
        setRequests({ sent: [], received: [] });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch requests";
      setError(errorMsg);
      toast.error(errorMsg);
      setRequests({ sent: [], received: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    // Only workers can accept requests
    if (userType !== "worker") {
      const errorMsg = "Only workers can accept requests";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setError(null);
      const response = await acceptRequest(requestId);

      if (response?.data?.success) {
        // toast.success("Request accepted successfully");
        // Refresh requests after accepting
        await fetchUserRequests();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || "Failed to accept request";
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to accept request";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Only workers can reject requests
    if (userType !== "worker") {
      const errorMsg = "Only workers can reject requests";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setError(null);
      const response = await rejectRequest(requestId);

      if (response?.data?.success) {
        toast.success("Request rejected successfully");
        // Refresh requests after rejecting
        await fetchUserRequests();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || "Failed to reject request";
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to reject request";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  };

  const handleCancelRequest = async (requestId) => {
    //only workers can cancel requests
    if (userType !== "worker") {
      const errorMsg = "Only workers can cancel requests";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    try {
      setError(null);
      const response = await cancelRequest(requestId); // Assuming cancelRequest is similar to rejectRequest
      if (response?.data?.success) {
        toast.success("Request cancelled successfully");
        // Refresh requests after cancelling
        await fetchUserRequests();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || "Failed to cancel request";
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to cancel request";
      setError(errorMsg);
      toast.error(errorMsg);
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
    cancelRequest: handleCancelRequest,
    refetchRequests: fetchUserRequests,
  };
};

// Separate hook for handling available workers (used in Network page)
export const useAvailableWorkers = () => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

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
        const errorMsg =
          response?.data?.message || "Failed to fetch available workers";
        setError(errorMsg);
        toast.error(errorMsg);
        setAvailableUsers([]);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch available workers";
      setError(errorMsg);
      toast.error(errorMsg);
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId, message) => {
    try {
      setError(null);
      const response = await sendRequest({
        senderId: user?.userId || user?._id,
        receiverId,
        message,
      });

      if (response?.data?.success) {
        toast.success("Request sent successfully");
        // Refresh available users after sending request
        await fetchAvailableUsers();
        return response.data.data;
      } else {
        const errorMsg = response?.data?.message || "Failed to send request";
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send request";
      setError(errorMsg);
      toast.error(errorMsg);
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
    refetchUsers: fetchAvailableUsers,
  };
};
