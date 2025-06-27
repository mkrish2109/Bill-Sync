import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTasks } from "react-icons/fa";
import { api } from "../../../helper/apiHelper";
import { getUserRequests } from "../../../services/apiServices";
import { PageMeta } from "../../../components/common/PageMeta";
import Dashboard from "../../../components/dashboard/Dashboard";
import AssignmentCard from "../../../components/assignment/AssignmentCard";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0,
  });

  // Memoize the transformed assignments to prevent unnecessary recalculations
  const transformedAssignments = useMemo(
    () =>
      assignments.map((item) => ({
        ...item,
        status: item.assignmentStatus || "unassigned",
      })),
    [assignments]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignmentsResponse, requestsResponse] = await Promise.all([
          api.get(`/workers/fabrics`),
          getUserRequests(),
        ]);
        console.log(assignmentsResponse, requestsResponse);

        setAssignments(assignmentsResponse?.data?.data);

        // Process request status data
        const { sentRequests, receivedRequests } = requestsResponse?.data?.data;
        const allRequests = [...sentRequests, ...receivedRequests];

        const statusCounts = allRequests.reduce(
          (acc, request) => {
            acc[request.status] = (acc[request.status] || 0) + 1;
            acc.total = (acc.total || 0) + 1;
            return acc;
          },
          { pending: 0, accepted: 0, rejected: 0, total: 0 }
        );

        setRequestStatus(statusCounts);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.userId || user?._id]);

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    if (!assignmentId || !newStatus) {
      setError("Invalid assignment ID or status");
      return;
    }
    try {
      await api.put(`/assignments/update-status/${assignmentId}`, {
        status: newStatus,
      });

      // Refresh assignments
      const response = await api.get(`/workers/fabrics`);
      setAssignments(response.data.data);
    } catch (err) {
      console.log(err);
      setError(err.response.data.error || "Failed to update status");
    }
  };

  return (
    <>
      <PageMeta
        title="Worker Dashboard | Bill Sync - Manage Your Tasks"
        description="Access your worker dashboard to manage tasks, track assignments, and monitor your work progress on Bill Sync."
        keywords="worker dashboard, task management, work assignments, progress tracking, worker tools"
      />
      <Dashboard
        title="My Assignments"
        items={transformedAssignments}
        loading={loading}
        error={error}
        setError={setError}
        itemType="assignments"
        statusKey="status"
        searchKeys={["fabric.name", "buyer.name", "instructions"]}
        emptyStateIcon={FaTasks}
        showAddButton={false}
        renderCard={(item) => (
          <AssignmentCard
            key={item._id || item.assignmentId}
            assignment={item}
            onStatusUpdate={handleStatusUpdate}
            onClick={() => navigate(`/worker/fabrics/${item.fabric._id}`)}
          />
        )}
        userRequests={requestStatus}
      />
    </>
  );
};

export default React.memo(WorkerDashboard);
