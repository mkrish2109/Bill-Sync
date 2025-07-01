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
  console.log(fabric);
  return (
    <div className="w-full md:w-2/3 p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">
          {fabric.name}
        </h1>
        <p className="text-base sm:text-lg text-secondary-light dark:text-text-secondaryDark">
          {fabric.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-4 sm:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="font-semibold text-lg sm:text-xl text-text-light dark:text-text-dark mb-4 flex items-center">
            <FaUser className="mr-2 text-primary-light dark:text-primary-dark" />
            {user.role === "worker"
              ? "Buyer Information"
              : "Assigned Worker Information"}
          </h2>
          <div className="space-y-3">
            <p className="flex items-center text-text-light dark:text-text-dark text-base sm:text-lg">
              <span className="font-medium mr-2 text-sm sm:text-base">Name:</span>
              {user.role === "worker"
                ? fabric.buyer?.name
                : fabric.worker?.name || "N/A"}
            </p>
            {fabric.buyer?.company && (
              <p className="flex items-center text-secondary-light dark:text-text-secondaryDark text-base sm:text-lg">
                <FaBuilding className="mr-2" />
                {fabric.buyer.company}
              </p>
            )}
            <p className="flex items-center text-secondary-light dark:text-text-secondaryDark text-base sm:text-lg">
              <FaPhone className="mr-2" />
              {user.role === "worker"
                ? fabric.buyer?.contact || "N/A"
                : fabric.worker?.contact || "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-4 sm:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="font-semibold text-lg sm:text-xl text-text-light dark:text-text-dark mb-4">
            Fabric Specifications
          </h2>
          <div className="space-y-3">
            <p className="flex justify-between items-center text-text-light dark:text-text-dark text-base sm:text-lg">
              <span className="font-medium text-sm sm:text-base">Quantity:</span>
              <span className="text-primary-light dark:text-primary-dark text-base sm:text-lg">
                {fabric.quantity} {fabric.unit}
              </span>
            </p>
            <p className="flex justify-between items-center text-text-light dark:text-text-dark text-base sm:text-lg">
              <span className="font-medium text-sm sm:text-base">Unit Price:</span>
              <span className="text-primary-light dark:text-primary-dark text-base sm:text-lg">
                ${fabric.unitPrice?.toFixed(2) || "0.00"}
              </span>
            </p>
            <p className="flex justify-between items-center text-text-light dark:text-text-dark text-base sm:text-lg">
              <span className="font-medium text-sm sm:text-base">Total Price:</span>
              <span className="text-primary-light dark:text-primary-dark text-base sm:text-lg">
                ${fabric.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {fabric.assignmentStatus && (
        <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-4 sm:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="font-semibold text-lg sm:text-xl text-text-light dark:text-text-dark mb-4">
            Current Status
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <StatusBadge status={fabric.assignmentStatus} />

            {user.role === "worker" && (
              <select
                value={fabric.assignmentStatus}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className={`py-2 px-4 text-sm sm:text-base rounded-lg border ${colors.bg}  ${colors.text} ${colors.border} focus:outline-none focus:ring-1 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200 hover:shadow-md`}
              >
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>
          {fabric.assignedAt && (
            <p className="text-xs sm:text-sm text-secondary-light dark:text-text-secondaryDark mt-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-primary-light dark:text-primary-dark" />
              Assigned on: {new Date(fabric.assignedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
