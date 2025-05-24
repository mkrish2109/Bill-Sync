// components/dashboard/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTasks, FaPlus, FaChartLine, FaSearch } from 'react-icons/fa';
import StatusFilter from '../common/StatusFilter';
import SearchInput from '../common/SearchInput';
import { ErrorAlert } from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = ({
  title,
  items,
  loading,
  error,
  setError,
  itemType = 'items',
  statusKey = 'status',
  searchKeys = ['name'],
  statusOptions = ['all', 'assigned', 'in-progress', 'completed'],
  renderCard,
  emptyStateIcon: EmptyStateIcon = FaBox,
  onAddNew,
  addNewLabel = 'Add New',
  showAddButton = true,
  onStatusUpdate,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate status counts
  const statusCounts = items.reduce((acc, item) => {
    const status = item[statusKey] || 'unassigned';
    acc[status] = (acc[status] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {});

  // Filter items based on status and search query
  const filteredItems = items.filter(item => {
    const statusMatch = filter === 'all' || (item[statusKey] || 'unassigned') === filter;
    
    const searchMatch = searchQuery === '' || 
      searchKeys.some(key => {
        const value = getNestedValue(item, key) || '';
        return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      });
    
    return statusMatch && searchMatch;
  });

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorAlert error={error} onDismiss={() => setError(null)} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4 md:mb-0">
          {title}
        </h1>
        
        {showAddButton && (
          <button 
            onClick={onAddNew}
            className="bg-primary-light dark:bg-primary-dark text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-primary-light/90 dark:hover:bg-primary-dark/90 transition-colors duration-200 font-medium"
          >
            <FaPlus className="mr-2" />
            {addNewLabel}
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Total {itemType}</h3>
          <p className="text-3xl font-bold text-blue-500">{statusCounts.total || 0}</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Assigned</h3>
          <p className="text-3xl font-bold text-yellow-500">{statusCounts.assigned || 0}</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-orange-500">{statusCounts['in-progress'] || 0}</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{statusCounts.completed || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm">
        <StatusFilter 
          currentFilter={filter}
          onFilterChange={setFilter}
          counts={statusCounts}
          statusOptions={statusOptions}
        />
        
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${itemType}...`}
        />
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm">
          <EmptyStateIcon className="mx-auto text-5xl text-text-light/60 dark:text-text-dark/60 mb-4" />
          <h3 className="text-2xl font-medium text-text-light dark:text-text-dark mb-2">
            No {itemType} found
          </h3>
          <p className="text-text-light/80 dark:text-text-dark/80">
            {searchQuery ? 'Try a different search term' : `You currently have no ${itemType}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => renderCard(item))}
        </div>
      )}
    </div>
  );
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((o, p) => (o || {})[p], obj);
};

export default Dashboard;