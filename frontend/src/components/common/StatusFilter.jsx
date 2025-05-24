import React from 'react';

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
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentFilter === status 
              ? 'bg-primary-light dark:bg-primary-dark text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark'
          }`}
        >
          {statusLabels[status]} {counts[status] ? `(${counts[status]})` : ''}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;