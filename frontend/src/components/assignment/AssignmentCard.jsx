import React from 'react';
import { FaBox, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { StatusBadge } from '../common/StatusBadge';

const AssignmentCard = ({ assignment, onClick, onStatusUpdate }) => {
  // Safely handle undefined/null values
  const status = assignment?.status || 'unknown';
  const fabricName = assignment?.fabric?.name || 'Unnamed Fabric';
  const instructions = assignment?.instructions || '';
  const referenceNumber = assignment?.buyer?.name || 'N/A';
  const assignedDate = assignment?.assignedDate ? new Date(assignment.assignedDate) : new Date();

 
  const handleStatusClick = (e, newStatus) => {
    e.stopPropagation();
    if (onStatusUpdate && assignment?.assignmentId) {
      onStatusUpdate(assignment._id || assignment.assignmentId, newStatus);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-md overflow-hidden border border-border-light dark:border-border-dark cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark truncate max-w-[70%]">
            {fabricName}
          </h3>
          <StatusBadge status={status} />
        </div>
        
        {instructions && (
          <p className="text-sm text-text-light/80 dark:text-text-dark/80 mb-4 line-clamp-2">
            {instructions}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-text-light/90 dark:text-text-dark/90">
            <FaBox className="mr-2 text-blue-500" />
            <span>Ref: {referenceNumber}</span>
          </div>
          
          <div className="flex items-center text-sm text-text-light/90 dark:text-text-dark/90">
            <FaCalendarAlt className="mr-2 text-green-500" />
            <span>Assigned: {assignedDate.toLocaleDateString()}</span>
          </div>
        </div>
        
        {status !== 'completed' && (
          <div className="flex space-x-3">
            <button
              onClick={(e) => handleStatusClick(e, 'in-progress')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center transition-colors duration-200 font-medium"
            >
              <FaClock className="mr-2" /> Start
            </button>
            <button
              onClick={(e) => handleStatusClick(e, 'completed')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center transition-colors duration-200 font-medium"
            >
              <FaCheckCircle className="mr-2" /> Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;