import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Button } from "flowbite-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { ErrorAlert } from "../common/Alert";
import { statusColors } from "../../utils/colors";
import { FabricCard } from "./FabricCard";

export const FabricList = ({
  fabrics: fabricsProp,
  loading,
  error,
  viewType = "buyer",
  onStatusChange,
  onDelete,
  onFilterChange,
  statusFilter,
  showAddButton = false,
  onUpdate,
}) => {
  // Use local state for fabrics so we can update them on edit
  const [fabrics, setFabrics] = useState(fabricsProp || []);

  // Keep local fabrics in sync with prop
  useEffect(() => {
    setFabrics(fabricsProp || []);
  }, [fabricsProp]);

  const navigate = useNavigate();
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  // Handler to update a fabric in the list
  const handleFabricUpdate = (updatedFabric) => {
    setFabrics((prevFabrics) =>
      prevFabrics.map((fabric) =>
        fabric._id === updatedFabric._id ? updatedFabric : fabric
      )
    );
    if (onUpdate) onUpdate(updatedFabric);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          {viewType === "worker" ? "My Fabric Assignments" : "Fabric Inventory"}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {onFilterChange && (
            <select
              value={statusFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              {viewType === "worker" && (
                <option value="cancelled">Cancelled</option>
              )}
            </select>
          )}

          {showAddButton && (
            <Button
              color="secondary"
              onClick={() => navigate("/buyer/fabrics/add")}
              to="/buyer/fabrics/add"
              className="px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <FaPlus /> Add New Fabric
            </Button>
          )}
        </div>
      </div>

      {fabrics.length === 0 ? (
        <div className="text-center py-12 bg-background-surfaceLight dark:bg-background-surfaceDark rounded-lg border border-border-light dark:border-border-dark text-secondary-light dark:text-text-secondaryDark">
          No fabrics found
        </div>
      ) : (
        <div className="grid gap-4">
          {fabrics.map((fabric) => (
            <FabricCard
              key={fabric._id}
              fabric={fabric}
              viewType={viewType}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              statusColors={statusColors}
              onUpdate={handleFabricUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
