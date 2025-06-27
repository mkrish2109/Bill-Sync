import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaHistory, FaInfoCircle, FaUser } from "react-icons/fa";
import { api } from "../../../helper/apiHelper";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { ErrorAlert } from "../../../components/common/Alert";
import { statusColors } from "../../../utils/colors";
import { PageMeta } from "../../../components/common/PageMeta";
import { FabricHeader } from "../../../components/fabrics/FabricHeader";
import { FabricImage } from "../../../components/fabrics/FabricImage";
import { FabricBasicInfo } from "../../../components/fabrics/FabricBasicInfo";
import { TabButton } from "../../../components/common/TabButton";
import { DetailsTab } from "../../../components/fabrics/tabs/DetailsTab";
import { AssignmentsTab } from "../../../components/fabrics/tabs/AssignmentsTab";
import { HistoryTab } from "../../../components/fabrics/tabs/HistoryTab";

const FabricDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [statusHistory, setStatusHistory] = useState([]);
  const [changeHistory, setChangeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchFabricDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/fabrics/${id}`);
        const fabricData = response.data.data;
        setFabric(fabricData);
        setStatusHistory(fabricData.statusHistory || []);
        setChangeHistory(fabricData.changeHistory || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFabricDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!fabric?.assignmentId) {
      setError("No assignment found for this fabric");
      return;
    }

    confirmAlert({
      title: "Confirm status change",
      message: `Are you sure you want to change status to ${newStatus}?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await api.put(
                `/assignments/update-status/${fabric.assignmentId}`,
                {
                  status: newStatus,
                }
              );

              const fabricResponse = await api.get(`/fabrics/${id}`);
              setFabric(fabricResponse.data.data);

              setHistoryLoading(true);
              try {
                const historyResponse = await api.get(
                  `/assignments/${fabric.assignmentId}/history`
                );
                setStatusHistory(historyResponse.data.data);
              } catch (historyError) {
                console.error("Error fetching history:", historyError);
                setStatusHistory([]);
              } finally {
                setHistoryLoading(false);
              }
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

  const handleDelete = async () => {
    confirmAlert({
      title: "Confirm to delete",
      message:
        "Are you sure you want to delete this fabric? This action cannot be undone.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await api.delete(`/buyers/fabrics/${id}`);
              navigate("/buyer/fabrics");
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

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorAlert error={error} onDismiss={() => setError(null)} />;
  if (!fabric)
    return (
      <div className="text-center py-8 text-text-light dark:text-text-dark">
        Fabric not found
      </div>
    );
  console.log(statusColors[fabric.assignmentStatus]);

  return (
    <>
      <PageMeta
        title="Fabric Details | Bill Sync - View Fabric Information"
        description="View comprehensive details about your fabric, including specifications, status, and related information. Track your fabric's progress and history."
        keywords="fabric details, fabric information, fabric specifications, fabric status, fabric tracking"
      />
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        <FabricHeader fabric={fabric} onDelete={handleDelete} />

        <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-lg overflow-hidden border border-border-light dark:border-border-dark">
          {/* Header with image and basic info */}
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-4 sm:p-6 ">
              <FabricImage imageUrl={fabric.imageUrl} name={fabric.name} />
            </div>
            <FabricBasicInfo
              fabric={fabric}
              handleStatusUpdate={handleStatusUpdate}
              user={user}
              statusColors={statusColors}
            />
          </div>

          {/* Tabs for additional information */}
          <div className="border-t border-border-light dark:border-border-dark bg-background-surfaceLight dark:bg-background-surfaceDark">
            <div className="flex overflow-x-auto scrollbar-hide">
              <TabButton
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
                icon={FaInfoCircle}
              >
                Details
              </TabButton>

              {fabric.workers?.length > 0 && (
                <TabButton
                  active={activeTab === "assignments"}
                  onClick={() => setActiveTab("assignments")}
                  icon={FaUser}
                >
                  Assignments
                </TabButton>
              )}

              {(statusHistory.length > 0 || changeHistory.length > 0) && (
                <TabButton
                  active={activeTab === "history"}
                  onClick={() => setActiveTab("history")}
                  icon={FaHistory}
                >
                  History
                </TabButton>
              )}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6 md:p-8 bg-background-light dark:bg-background-dark">
            {activeTab === "details" && <DetailsTab fabric={fabric} />}
            {activeTab === "assignments" && (
              <AssignmentsTab workers={fabric.workers} />
            )}
            {activeTab === "history" && (
              <HistoryTab
                statusHistory={statusHistory}
                changeHistory={changeHistory}
                loading={historyLoading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FabricDetails;
