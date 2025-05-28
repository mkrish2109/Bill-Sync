import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { FabricCard } from './FabricCard';
import { ErrorAlert } from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';
import { statusColors } from '../../utils/colors';

export const FabricList = ({
  fabrics,
  loading,
  error,
  viewType = 'buyer',
  onStatusChange,
  onDelete,
  onFilterChange,
  statusFilter,
  showAddButton = false,
  onUpdate
}) => {


  if (loading ) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          {viewType === 'worker' ? 'My Fabric Assignments' : 'Fabric Inventory'}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {onFilterChange && (
            <select
              value={statusFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              {viewType === 'worker' && <option value="cancelled">Cancelled</option>}
            </select>
          )}
          
          {showAddButton && (
            <Link 
              to="/buyer/fabrics/add" 
              className="bg-primary-light dark:bg-primary-dark hover:bg-primary-hoverLight dark:hover:bg-primary-hoverDark text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <FaPlus /> Add New Fabric
            </Link>
          )}
        </div>
      </div>

      {fabrics.length === 0 ? (
        <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
          No fabrics found
        </div>
      ) : (
        <div className="grid gap-4">
          {fabrics.map(fabric => (
            <FabricCard
              key={fabric._id}
              fabric={fabric}
              viewType={viewType}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              statusColors={statusColors}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};