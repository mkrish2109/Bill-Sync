import React from "react";
import { FaBox, FaUser, FaCalendarAlt } from "react-icons/fa";
import { StatusBadge } from "../../../../components/common/StatusBadge";

const FabricCard = ({ fabric, onClick }) => {
  // Safely handle undefined/null values
  const status = fabric?.assignments?.status || "unassigned";
  const name = fabric?.fabric?.name || "Unnamed Fabric";
  const description = fabric?.fabric?.description || "";
  const referenceNumber = fabric?.worker?.contact || "N/A";
  const worker = fabric?.worker || null;
  const createdAt = fabric?.fabric?.createdAt
    ? new Date(fabric.fabric.createdAt)
    : new Date();

  return (
    <div
      onClick={onClick}
      className="bg-background-light dark:bg-background-dark rounded-xl shadow-md overflow-hidden border border-border-light dark:border-border-dark cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark truncate max-w-[70%]">
            {name}
          </h3>
          <StatusBadge status={status} />
        </div>

        {description && (
          <p className="text-sm text-text-light/80 dark:text-text-dark/80 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-text-light/90 dark:text-text-dark/90">
            <FaBox className="mr-2 text-blue-500 dark:text-blue-400" />
            <span>Ref: {referenceNumber}</span>
          </div>

          {worker && (
            <div className="flex items-center text-sm text-text-light/90 dark:text-text-dark/90">
              <FaUser className="mr-2 text-purple-500 dark:text-purple-400" />
              <span>Assigned to: {worker.name}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-text-light/90 dark:text-text-dark/90">
            <FaCalendarAlt className="mr-2 text-green-500 dark:text-green-400" />
            <span>Created: {createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricCard;
