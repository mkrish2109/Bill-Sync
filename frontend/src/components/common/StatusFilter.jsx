import React from 'react';
// Import colors if needed, but we'll use class names directly for now
// import { statusColors } from '../utils/colors';

const StatusFilter = ({ currentFilter, onFilterChange, counts, statusOptions = ['all', 'assigned', 'in-progress', 'completed'] }) => {
  const statusLabels = {
    all: 'All',
    assigned: 'Assigned',
    'in-progress': 'In Progress',
    completed: 'Completed'
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map(status => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          // Using direct Tailwind classes based on the color palette
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentFilter === status 
              ? 'bg-primary-light text-text-dark dark:bg-primary-dark dark:text-text-dark' // Active state: Light Primary BG/Dark Text, Dark Primary BG/Dark Text (White)
              : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark' // Inactive state: Light Gray BG/Light Text, Dark Gray BG/Dark Text
          }`}
        >
          {statusLabels[status]} {counts[status] ? `(${counts[status]})` : ''}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;