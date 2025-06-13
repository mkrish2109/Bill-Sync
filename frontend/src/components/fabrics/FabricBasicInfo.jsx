import { FaCalendarAlt, FaUser, FaBuilding, FaPhone } from "react-icons/fa";
import { StatusBadge } from "../common/StatusBadge";

export const FabricBasicInfo = ({
  fabric,
  handleStatusUpdate,
  user,
  statusColors,
}) => {
  const status = fabric.assignmentStatus || "assigned";
  const colors = statusColors[status] || statusColors.default;
  return (
    <div className="md:w-2/3 p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
          {fabric.name}
        </h1>
        <p className="text-lg text-secondary-light dark:text-text-secondaryDark">
          {fabric.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="font-semibold text-lg text-text-light dark:text-text-dark mb-4 flex items-center">
            <FaUser className="mr-2 text-primary-light dark:text-primary-dark" />
            Buyer Information
          </h2>
          <div className="space-y-3">
            <p className="flex items-center text-text-light dark:text-text-dark">
              <span className="font-medium mr-2">Name:</span>
              {fabric.buyerId?.name || "N/A"}
            </p>
            {fabric.buyerId?.company && (
              <p className="flex items-center text-secondary-light dark:text-text-secondaryDark">
                <FaBuilding className="mr-2" />
                {fabric.buyerId.company}
              </p>
            )}
            {fabric.buyerId?.contact && (
              <p className="flex items-center text-secondary-light dark:text-text-secondaryDark">
                <FaPhone className="mr-2" />
                {fabric.buyerId.contact}
              </p>
            )}
          </div>
        </div>

        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="font-semibold text-lg text-text-light dark:text-text-dark mb-4">
            Fabric Specifications
          </h2>
          <div className="space-y-3">
            <p className="flex justify-between items-center text-text-light dark:text-text-dark">
              <span className="font-medium">Quantity:</span>
              <span className="text-primary-light dark:text-primary-dark">
                {fabric.quantity} {fabric.unit}
              </span>
            </p>
            <p className="flex justify-between items-center text-text-light dark:text-text-dark">
              <span className="font-medium">Unit Price:</span>
              <span className="text-primary-light dark:text-primary-dark">
                ${fabric.unitPrice?.toFixed(2) || "0.00"}
              </span>
            </p>
            <p className="flex justify-between items-center text-text-light dark:text-text-dark">
              <span className="font-medium">Total Price:</span>
              <span className="text-primary-light dark:text-primary-dark">
                ${fabric.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {fabric.assignmentStatus && (
        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="font-semibold text-lg text-text-light dark:text-text-dark mb-4">
            Current Status
          </h2>
          <div className="flex items-center gap-4">
            <StatusBadge status={fabric.assignmentStatus} />

            {user.role === "worker" && (
              <select
                value={fabric.assignmentStatus}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className={`py-2 px-4 text-sm rounded-lg border dark:border-border-dark bg-background-light dark:bg-background-dark ${
                  statusColors[fabric.assignmentStatus] ||
                  "bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-text-secondaryDark"
                } focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200 hover:shadow-md`}
              >
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>
          {fabric.assignedAt && (
            <p className="text-sm text-secondary-light dark:text-text-secondaryDark mt-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-primary-light dark:text-primary-dark" />
              Assigned on: {new Date(fabric.assignedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
