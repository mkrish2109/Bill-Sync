import React, { useEffect, useState } from "react";
import { api } from "../../helper/apiHelper";
import FabricForm from "../fabrics/FabricForm";
import LoadingSpinner from "../common/LoadingSpinner";
import { ErrorAlert } from "../common/Alert";
import { useSocket } from "../../contexts/SocketContext";
import { toast } from "react-toastify";
import { PageMeta } from "../common/PageMeta";

const AddFabricForm = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const fetchConnectedWorkers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/requests/connections");
        if (response.data.success) {
          // Extract workers from connections data
          const connectedWorkers = response.data.data.connections.map(
            (connection) => connection.user
          );
          setWorkers(connectedWorkers);
        }
      } catch (err) {
        setError("Failed to fetch connected workers");
      } finally {
        setLoading(false);
      }
    };
    fetchConnectedWorkers();
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for fabric assignment notifications
    const handleFabricAssignment = (data) => {
      toast.info(data.message);
    };

    socket.on("new_fabric_assignment", handleFabricAssignment);

    return () => {
      socket.off("new_fabric_assignment", handleFabricAssignment);
    };
  }, [socket, isConnected]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <>
      <PageMeta
        title="Add New Fabric | Bill Sync - Create Fabric Entry"
        description="Create a new fabric entry with detailed specifications, measurements, and requirements. Streamline your fabric management process."
        keywords="add fabric, new fabric entry, fabric creation, fabric specifications, fabric management"
      />
      <div className="space-y-6">
        <FabricForm
          workers={workers}
          onSuccessRedirect="/buyer/fabrics"
          onCancelRedirect="/buyer/fabrics"
        />
      </div>
    </>
  );
};

export default AddFabricForm;
