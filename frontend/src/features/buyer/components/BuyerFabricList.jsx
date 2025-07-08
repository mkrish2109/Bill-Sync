import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { api } from "../../../helper/apiHelper";
import { useSocket } from "../../../contexts/SocketContext";
import { PageMeta } from "../../../components/common/PageMeta";
import { FabricList } from "../../../components/fabrics/FabricList";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { toastInfo } from "../../../utils/toastHelpers";

const BuyerFabricList = () => {
  const [fabricData, setFabricData] = useState({
    fabrics: [],
    loading: true,
    error: null,
  });
  const { socket, isConnected } = useSocket();
  const [selectedTab, setSelectedTab] = useState(0); // 0: All, 1: Drafts

  const fetchFabrics = async () => {
    try {
      setFabricData((prev) => ({ ...prev, loading: true }));
      const response = await api.get("/buyers/fabrics");
      const flattenedData = response.data.data.map((item) => ({
        ...item.fabric,
        buyer: item.buyer,
        worker: item.worker || null,
        assignment: item.assignments || [],
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
      toastInfo(data.message);
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

  // Filter fabrics based on selected tab
  let displayedFabrics = fabricData.fabrics;
  if (selectedTab === 0) {
    displayedFabrics = fabricData.fabrics.filter(
      (fabric) => fabric.status !== "draft"
    );
  } else if (selectedTab === 1) {
    displayedFabrics = fabricData.fabrics.filter(
      (fabric) => fabric.status === "draft"
    );
  }

  return (
    <>
      <PageMeta
        title="My Fabrics | Bill Sync - Fabric Management"
        description="Manage your fabric inventory, track assignments, and monitor the status of your fabrics. Add, edit, or remove fabrics as needed."
        keywords="fabric management, fabric inventory, fabric tracking, fabric assignments, fabric status"
      />
      <div className="mb-6">
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Fabrics" />
          <Tab label="Drafts" />
        </Tabs>
      </div>
      <FabricList
        fabrics={displayedFabrics}
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
