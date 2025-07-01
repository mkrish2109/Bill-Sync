import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import { api } from "../../../helper/apiHelper";
import { useSocket } from "../../../contexts/SocketContext";
import { PageMeta } from "../../../components/common/PageMeta";
import { FabricList } from "../../../components/fabrics/FabricList";

const BuyerFabricList = () => {
  const [fabricData, setFabricData] = useState({
    fabrics: [],
    loading: true,
    error: null,
  });
  const { socket, isConnected } = useSocket();

  const fetchFabrics = async () => {
    try {
      setFabricData((prev) => ({ ...prev, loading: true }));
      const response = await api.get("/buyers/fabrics");
      const flattenedData = response.data.data.map((item) => ({
        ...item.fabric,
        buyer: item.buyer,
        worker: item.worker || null,
        assignmentCount: item.assignmentCount,
      }));

      setFabricData({
        fabrics: flattenedData,
        loading: false,
        error: null,
      });
    } catch (err) {
      setFabricData({
        fabrics: [],
        loading: false,
        error: err.message,
      });
    }
  };

  useEffect(() => {
    fetchFabrics();
  }, []);

  useEffect(() => {
    // console.log("Socket connection status:", { isConnected, socket: !!socket });

    if (!socket || !isConnected) {
      console.log("Socket not connected, skipping event listener setup");
      return;
    }

    // Listen for fabric assignment notifications
    const handleFabricAssignment = (data) => {
      // console.log("Received fabric assignment notification:", data);
      toast.info(data.message);
      // Refresh the fabric list to show updated assignments
      fetchFabrics();
    };

    console.log("Setting up socket event listener for new_fabric_assignment");
    socket.on("new_fabric_assignment", handleFabricAssignment);

    return () => {
      console.log("Cleaning up socket event listener");
      socket.off("new_fabric_assignment", handleFabricAssignment);
    };
  }, [socket, isConnected]);

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this fabric?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await api.delete(`/buyers/fabrics/${id}`);
              setFabricData((prev) => ({
                ...prev,
                fabrics: prev.fabrics.filter((fabric) => fabric._id !== id),
              }));
            } catch (err) {
              setFabricData((prev) => ({
                ...prev,
                error: err.message,
              }));
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleFabricUpdate = (updatedFabric) => {
    setFabricData((prev) => ({
      ...prev,
      fabrics: prev.fabrics.map((fabric) =>
        fabric._id === updatedFabric._id
          ? {
              ...fabric,
              ...updatedFabric,
              worker:
                updatedFabric.worker !== undefined
                  ? updatedFabric.worker
                  : fabric.worker,
            }
          : fabric
      ),
    }));
  };

  return (
    <>
      <PageMeta
        title="My Fabrics | Bill Sync - Fabric Management"
        description="Manage your fabric inventory, track assignments, and monitor the status of your fabrics. Add, edit, or remove fabrics as needed."
        keywords="fabric management, fabric inventory, fabric tracking, fabric assignments, fabric status"
      />
      <FabricList
        fabrics={fabricData.fabrics}
        loading={fabricData.loading}
        error={fabricData.error}
        viewType="buyer"
        onDelete={handleDelete}
        onUpdate={handleFabricUpdate}
        showAddButton={true}
      />
    </>
  );
};

export default BuyerFabricList;
