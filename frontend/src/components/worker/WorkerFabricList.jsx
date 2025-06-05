import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../helper/apiHelper";
import { confirmAlert } from "react-confirm-alert";
import { FabricList } from "../fabrics/FabricList";
import { useSocket } from "../../contexts/SocketContext";
import { toast } from "react-toastify";

const WorkerFabricList = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const { socket, isConnected } = useSocket();

  const fetchWorkerFabrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/workers/fabrics");
      const allFabrics = response.data.data.map((item) => ({
        ...item.fabric,
        buyer: item.buyer,
        // worker: item.assignmentStatus || 'assigned' ,
        worker: item.worker,
        assignmentStatus: item.assignmentStatus,
        assignmentId: item.assignmentId,
        assignedAt: item.assignedAt,
      }));
      const filteredFabrics =
        statusFilter === "all"
          ? allFabrics
          : allFabrics.filter(
              (fabric) => fabric.assignmentStatus === statusFilter
            );

      setFabrics(filteredFabrics);
    } catch (err) {
      console.error("Error fetching worker fabrics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchWorkerFabrics();
  }, [fetchWorkerFabrics]);

  useEffect(() => {
    console.log("Worker socket connection status:", {
      isConnected,
      socket: !!socket,
    });

    if (!socket || !isConnected) {
      console.log("Worker socket not connected, skipping event listener setup");
      return;
    }

    // Listen for fabric assignment notifications
    const handleFabricAssignment = (data) => {
      console.log("Worker received fabric assignment notification:", data);
      toast.info(data.message);
      // Refresh the fabric list to show new assignment
      fetchWorkerFabrics();
    };

    console.log(
      "Setting up worker socket event listener for new_fabric_assignment"
    );
    socket.on("new_fabric_assignment", handleFabricAssignment);

    return () => {
      console.log("Cleaning up worker socket event listener");
      socket.off("new_fabric_assignment", handleFabricAssignment);
    };
  }, [socket, isConnected, fetchWorkerFabrics]);

  const handleStatusUpdate = async (fabricId, assignmentId, newStatus) => {
    confirmAlert({
      title: "Confirm status change",
      message: `Are you sure you want to change status to ${newStatus}?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await api.put(`/assignments/update-status/${assignmentId}`, {
                status: newStatus,
              });
              // Reload the data after status update
              await fetchWorkerFabrics();
            } catch (err) {
              setError(err.message);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <FabricList
      fabrics={fabrics}
      loading={loading}
      error={error}
      viewType="worker"
      onStatusChange={handleStatusUpdate}
      onFilterChange={setStatusFilter}
      statusFilter={statusFilter}
    />
  );
};

export default WorkerFabricList;
