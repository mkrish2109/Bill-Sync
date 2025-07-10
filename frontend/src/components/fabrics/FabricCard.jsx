import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { StatusBadge } from "../common/StatusBadge";
import Modal from "../ui/modal/Modal";
import EditFabricForm from "../../features/buyer/components/EditFabricForm";
import LoadingSpinner from "../common/LoadingSpinner";
import { statusColors } from "../../utils/colors";

export const FabricCard = ({
  fabric: initialFabric,
  viewType = "buyer",
  onStatusChange,
  onDelete,
  // statusColors,
  onUpdate,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [fabric, setFabric] = useState(initialFabric);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleEditClick = (e) => {
    e.preventDefault();
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateSuccess = (updatedFabric) => {
    setFabric(updatedFabric);
    if (onUpdate) {
      onUpdate(updatedFabric);
    }
    setShowEditModal(false);
  };

  const handleStatusChange = async (fabricId, assignmentId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(fabricId, assignmentId, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  const status =
    fabric.assignmentStatus || fabric?.assignment?.status || "assigned";
  const colors = statusColors[status] || statusColors.default;
  return (
    <>
      <div className="bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border-light dark:border-border-dark grid grid-cols-1 sm:grid-cols-2 items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={fabric.imageUrl}
              alt={fabric.name}
              className="w-16 h-16 object-cover rounded-md border border-border-light dark:border-border-dark"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder-fabric.jpg";
              }}
            />
            <div className="flex-1 min-w-0">
              <Link
                to={`/${viewType}/fabrics/${fabric._id}`}
                className="text-primary-light dark:text-primary-dark hover:text-primary-hoverLight dark:hover:text-primary-hoverDark font-medium transition-colors duration-200 block truncate"
              >
                {fabric.name}
              </Link>
              <p className="text-sm text-secondary-light dark:text-text-secondaryDark mt-1 line-clamp-2">
                {fabric.description?.substring(0, 50)}...
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {viewType === "worker" && (
              <div className="bg-background-surfaceLight dark:bg-background-surfaceDark rounded-md w-full sm:w-auto">
                {onStatusChange ? (
                  <div className="relative">
                    <select
                      value={fabric.assignmentStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          fabric._id,
                          fabric.assignmentId,
                          e.target.value
                        )
                      }
                      disabled={isUpdatingStatus}
                      className={`w-full p-1 text-sm rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark ${colors.bg}
                        ${colors.text}
                        ${colors.border} ${isUpdatingStatus}
                             ? "opacity-50 cursor-not-allowed"
                             : ""
                         }`}
                    >
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {isUpdatingStatus && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-md">
                        <LoadingSpinner />
                      </div>
                    )}
                  </div>
                ) : (
                  <StatusBadge status={status} />
                )}
              </div>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              <Link
                to={`/${viewType}/fabrics/${fabric._id}`}
                className="flex-1 sm:flex-none bg-secondary-light dark:bg-secondary-dark hover:bg-secondary-hoverLight dark:hover:bg-secondary-hoverDark dark:text-text-light text-text-dark px-3 py-1 rounded-md text-sm flex items-center justify-center gap-1 transition-colors duration-200"
              >
                <FaEye size={12} />{" "}
                <span className="sm:inline hidden">View</span>
              </Link>

              {viewType === "buyer" && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="flex-1 sm:flex-none bg-warning-base/50 hover:bg-warning-hover/50 text-text-light dark:text-text-dark px-3 py-1 rounded-md text-sm flex items-center justify-center gap-1 transition-colors duration-200"
                  >
                    <FaEdit size={12} />{" "}
                    <span className="sm:inline hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(fabric._id)}
                    className="flex-1 sm:flex-none bg-error-base hover:bg-error-hover text-white px-3 py-1 rounded-md text-sm flex items-center justify-center gap-1 transition-colors duration-200"
                  >
                    <FaTrash size={12} />{" "}
                    <span className="sm:inline hidden">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
          {viewType === "buyer" ? (
            <>
              <div>
                <h2 className="text-sm font-medium text-secondary-light dark:text-text-secondaryDark mb-2">
                  Assigned Worker(s)
                </h2>
                {fabric.worker ? (
                  <div className="space-y-3">
                    <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-text-light dark:text-text-dark">
                            {fabric.worker.name}
                          </p>
                          <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                            {fabric.worker.contact}
                          </p>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary-light dark:text-text-secondaryDark">
                    Not assigned
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-sm font-medium text-secondary-light dark:text-text-secondaryDark mb-2">
                  Fabric Details
                </h2>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4 bg-background-surfaceLight dark:bg-background-surfaceDark p-3 rounded-md">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Quantity
                    </p>
                    <p className="text-text-light dark:text-text-dark">
                      {fabric.quantity} {fabric.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Unit Price
                    </p>
                    <p className="text-text-light dark:text-text-dark">
                      ${fabric.unitPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Total Price
                    </p>
                    <p className="text-text-light dark:text-text-dark font-medium">
                      ${fabric.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-sm font-medium text-secondary-light dark:text-text-secondaryDark mb-2">
                  Buyer Information
                </h2>
                <div className="space-y-3">
                  <div className="bg-background-surfaceLight dark:bg-background-surfaceDark p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-text-light dark:text-text-dark">
                          {fabric.buyer?.name || "N/A"}
                        </p>
                        <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                          {fabric.buyer?.contact || "N/A"}
                        </p>
                        {/* {fabric.buyer?.company && (
                          <p className="text-sm text-secondary-light dark:text-text-secondaryDark mt-1">
                            {fabric.buyer.company}
                          </p>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div>
                <h2 className="text-sm font-medium text-secondary-light dark:text-text-secondaryDark mb-2">
                  Status
                </h2>
                <div className="bg-background-surfaceLight dark:bg-background-surfaceDark rounded-md">
                  {onStatusChange ? (
                    <div className="relative">
                      <select
                        value={fabric.assignmentStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            fabric._id,
                            fabric.assignmentId,
                            e.target.value
                          )
                        }
                        disabled={isUpdatingStatus}
                        className={`w-full p-3 text-sm rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark ${
                          colors.bg
                        }
                        ${colors.text}
                        ${colors.border} ${isUpdatingStatus}
                             ? "opacity-50 cursor-not-allowed"
                             : ""
                         }`}
                      >
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {isUpdatingStatus && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-md">
                          <LoadingSpinner />
                        </div>
                      )}
                    </div>
                  ) : (
                    <StatusBadge status={fabric.assignmentStatus} />
                  )}
                </div>
              </div> */}

              <div>
                <h2 className="text-sm font-medium text-secondary-light dark:text-text-secondaryDark mb-2">
                  Assignment Details
                </h2>
                <div className="grid md:grid-cols-4 grid-cols-2 gap-4 bg-background-surfaceLight dark:bg-background-surfaceDark p-3 rounded-md">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Quantity
                    </p>
                    <p className="text-text-light dark:text-text-dark">
                      {fabric.quantity} {fabric.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Unit Price
                    </p>
                    <p className="text-text-light dark:text-text-dark">
                      ${fabric.unitPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Total Price
                    </p>
                    <p className="text-text-light dark:text-text-dark font-medium">
                      ${fabric.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-text-secondaryDark">
                      Assigned On
                    </p>
                    <p className="text-text-light dark:text-text-dark font-medium">
                      {fabric.assignedAt
                        ? new Date(fabric.assignedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          className="max-w-2xl p-0"
        >
          <EditFabricForm
            fabricId={fabric._id}
            initialData={fabric}
            onClose={handleCloseModal}
            onSuccess={handleUpdateSuccess}
          />
        </Modal>
      )}
    </>
  );
};
