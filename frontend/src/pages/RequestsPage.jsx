import React, { useEffect, useCallback, useRef, useState } from "react";
import { useRequests } from "../hooks/useRequests";
import RequestTabs from "../components/RequestTabs";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/Alert";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { PageMeta } from "../components/common/PageMeta";

const RequestsPage = () => {
  const { user } = useAuth();
  const userType = user.role.toLowerCase();
  const {
    requests,
    loading,
    error,
    acceptRequest,
    refetchRequests,
    cancelRequest,
  } = useRequests(userType);
  const { socket, isConnected, isInitializing } = useSocket();
  const listenersSetRef = useRef(false);
  const [isSocketReady, setIsSocketReady] = useState(false);

  const handleNewRequest = useCallback(
    (data) => {
      toast.info(`New request received from ${data.senderName}`);
      refetchRequests();
    },
    [refetchRequests]
  );

  const handleRequestStatusUpdate = useCallback(
    (data) => {
      data.status === "accepted"
        ? toast.success(
            `Request status updated: ${
              userType === "buyer" ? data.workerName : data.buyerName
            } is now ${data.status}`
          )
        : toast.error(
            `Request status updated: ${
              userType === "buyer" ? data.workerName : data.buyerName
            } is now ${data.status}`
          );

      refetchRequests();
    },
    [refetchRequests, userType]
  );

  useEffect(() => {
    if (isInitializing) {
      return; // Don't do anything while socket is initializing
    }

    // Add a small delay to ensure socket is ready
    const socketReadyTimeout = setTimeout(() => {
      setIsSocketReady(true);
    }, 2000);

    return () => {
      clearTimeout(socketReadyTimeout);
    };
  }, [isInitializing]);

  useEffect(() => {
    if (!isSocketReady || isInitializing) {
      return;
    }

    if (!socket || !isConnected) {
      if (socket && !isConnected) {
        toast.warning(
          "Connection to real-time updates is not available. Some features may be limited."
        );
      }
      return;
    }

    if (listenersSetRef.current) {
      return;
    }

    try {
      // Listen for new requests and status updates
      socket.on("new_request", handleNewRequest);
      socket.on("request_status_update", handleRequestStatusUpdate);

      // Handle connection events
      socket.on("connect_error", (error) => {
        toast.error("Connection error: " + error.message);
      });

      socket.on("reconnect_attempt", (attemptNumber) => {
        toast.info(`Attempting to reconnect (${attemptNumber}/5)...`);
      });

      socket.on("reconnect", () => {
        toast.success("Reconnected to real-time updates");
        refetchRequests(); // Refresh data after reconnection
      });

      listenersSetRef.current = true;
    } catch (error) {
      console.error("Error setting up socket listeners:", error);
      toast.error("Failed to setup real-time updates");
    }

    // Cleanup function
    return () => {
      if (socket && listenersSetRef.current) {
        try {
          socket.off("new_request", handleNewRequest);
          socket.off("request_status_update", handleRequestStatusUpdate);
          socket.off("connect_error");
          socket.off("reconnect_attempt");
          socket.off("reconnect");
          listenersSetRef.current = false;
        } catch (error) {
          console.error("Error cleaning up socket listeners:", error);
        }
      }
    };
  }, [
    socket,
    isConnected,
    isInitializing,
    isSocketReady,
    handleNewRequest,
    handleRequestStatusUpdate,
    refetchRequests,
  ]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptRequest(requestId);
    } catch (error) {
      toast.error(error.message || "Failed to accept request");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelRequest(requestId);
    } catch (error) {
      toast.error(error.message || "Failed to cancel request");
    }
  };

  // Filter requests based on user type
  const filteredRequests = {
    sent: userType === "buyer" ? requests.sent : [],
    received: userType === "worker" ? requests.received : [],
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <>
      <PageMeta
        title="Requests | Bill Sync - Manage Your Service Requests"
        description="Track and manage your service requests on Bill Sync. Handle incoming and outgoing requests efficiently with our intuitive interface."
        keywords="service requests, request management, work requests, service tracking, request handling"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-primary-light dark:text-primary-dark">
          {userType === "buyer" ? "Sent Requests" : "Received Requests"}
        </h1>
        <RequestTabs
          userType={userType}
          sentRequests={filteredRequests.sent}
          receivedRequests={filteredRequests.received}
          onAccept={handleAcceptRequest}
          onReject={handleCancelRequest}
        />
      </div>
    </>
  );
};

export default RequestsPage;
