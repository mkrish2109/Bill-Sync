import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { StatusBadge } from '../common/StatusBadge';
import Modal from '../ui/modal/Modal';
import EditFabricForm from '../buyer/EditFabricForm';
import LoadingSpinner from '../common/LoadingSpinner';

export const FabricCard = ({
  fabric: initialFabric,
  viewType = 'buyer',
  onStatusChange,
  onDelete,
  statusColors,
  onUpdate
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

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-4">
          <img 
            src={fabric.imageUrl} 
            alt={fabric.name} 
            className="w-16 h-16 object-cover rounded-md border border-border-light dark:border-border-dark"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder-fabric.jpg';
            }}
          />
          <div className="flex-1">
            <Link 
              to={`/fabrics/${fabric._id}`} 
              className="text-primary-light dark:text-primary-dark hover:text-primary-hoverLight dark:hover:text-primary-hoverDark font-medium transition-colors duration-200"
            >
              {fabric.name}
            </Link>
            <p className="text-sm text-secondary-light dark:text-secondary-dark mt-1">
              {fabric.description?.substring(0, 50)}...
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Link 
              to={`/${viewType}/fabrics/${fabric._id}`}
              className="bg-primary-light dark:bg-primary-dark hover:bg-primary-hoverLight dark:hover:bg-primary-hoverDark text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
            >
              <FaEye size={12} /> View
            </Link>
            
            {viewType === 'buyer' && (
              <>
                <button
                  onClick={handleEditClick}
                  className="bg-warning-base hover:bg-warning-hover text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
                >
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={() => onDelete(fabric._id)}
                  className="bg-error-base hover:bg-error-hover text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
                >
                  <FaTrash size={12} /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {viewType === 'buyer' ? (
            <>
              <div>
                <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Assigned Worker(s)</h3>
                {fabric.worker ? (
                  <div className="space-y-3">
                    <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-text-light dark:text-text-dark">{fabric.worker.name}</p>
                          <p className="text-sm text-secondary-light dark:text-secondary-dark">{fabric.worker.contact}</p>
                        </div>
                        <StatusBadge status={fabric.worker.status} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary-light dark:text-secondary-dark">Not assigned</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Fabric Details</h3>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-md">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Quantity</p>
                    <p className="text-text-light dark:text-text-dark">
                      {fabric.quantity} {fabric.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Unit Price</p>
                    <p className="text-text-light dark:text-text-dark">
                      ${fabric.unitPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Total Price</p>
                    <p className="text-text-light dark:text-text-dark font-medium">
                      ${fabric.totalPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Buyer Information</h3>
                <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-md">
                  <p className="font-medium text-text-light dark:text-text-dark">{fabric.buyer?.name || 'N/A'}</p>
                  {fabric.buyer?.company && (
                    <p className="text-sm text-secondary-light dark:text-secondary-dark mt-1">{fabric.buyer.company}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Status</h3>
                <div className="bg-surface-light dark:bg-surface-dark rounded-md">
                  {onStatusChange ? (
                    <div className="relative">
                      <select
                        value={fabric.assignmentStatus}
                        onChange={(e) => handleStatusChange(fabric._id, fabric.assignmentId, e.target.value)}
                        disabled={isUpdatingStatus}
                        className={`w-full p-3 text-sm rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark ${statusColors[fabric.assignmentStatus] || 'bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark'} focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {isUpdatingStatus && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-md">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <StatusBadge status={fabric.assignmentStatus} />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Assignment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Quantity</p>
                    <p className="text-text-light dark:text-text-dark">
                      {fabric.quantity} {fabric.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">Assigned On</p>
                    <p className="text-secondary-light dark:text-secondary-dark">
                      {fabric.assignedAt 
                        ? new Date(fabric.assignedAt).toLocaleDateString() 
                        : 'N/A'}
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
        <Modal isOpen={showEditModal} onClose={handleCloseModal} className="max-w-2xl p-0">
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