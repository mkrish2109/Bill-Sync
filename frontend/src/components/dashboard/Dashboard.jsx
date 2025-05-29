import React, { useState } from 'react';
import { FaBox, FaPlus } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import StatusFilter from '../common/StatusFilter';
import SearchInput from '../common/SearchInput';
import { ErrorAlert } from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

// Register only used ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  showCharts = true,
  userRequests = {
    pending: 0,
    accepted: 0,
    rejected: 0,
  }
}) => {
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

  // Chart data
  const statusChartData = {
    labels: ['Assigned', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [{
      data: [
        statusCounts.assigned || 0,
        statusCounts['in-progress'] || 0,
        statusCounts.completed || 0,
        statusCounts.cancelled || 0
      ],
      backgroundColor: [
        'rgba(245, 158, 11, 0.7)', // yellow
        'rgba(59, 130, 246, 0.7)', // blue
        'rgba(16, 185, 129, 0.7)', // green
        'rgba(239, 68, 68, 0.7)'  // red
      ],
      borderColor: [
        'rgba(245, 158, 11, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1,
    }]
  };

  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Items',
        data: [12, 19, 15, 17, 22, 25, 20],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Completed',
        data: [8, 12, 10, 14, 18, 15, 12],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const requestStatusData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [{
      data: [
        userRequests.pending || 0,
        userRequests.accepted || 0,
        userRequests.rejected || 0
      ],
      backgroundColor: [
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderColor: [
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
    },
    elements: {
      arc: {
        borderRadius: 4
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} onDismiss={() => setError(null)} />;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        
        {showAddButton && (
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
          >
            <FaPlus className="text-sm" />
            {addNewLabel}
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          label={`Total ${itemType}`} 
          value={statusCounts.total || 0} 
          color="text-blue-500" 
        />
        <StatCard 
          label="Assigned" 
          value={statusCounts.assigned || 0} 
          color="text-yellow-500" 
        />
        <StatCard 
          label="In Progress" 
          value={statusCounts['in-progress'] || 0} 
          color="text-orange-500" 
        />
        <StatCard 
          label="Completed" 
          value={statusCounts.completed || 0} 
          color="text-green-500" 
        />
      </div>

      {/* Request Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard 
          label="Pending Requests" 
          value={userRequests.pending || 0} 
          color="text-yellow-500" 
        />
        <StatCard 
          label="Accepted Requests" 
          value={userRequests.accepted || 0} 
          color="text-green-500" 
        />
        <StatCard 
          label="Rejected Requests" 
          value={userRequests.rejected || 0} 
          color="text-red-500" 
        />
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <ChartCard title="Fabric Status">
            <Doughnut data={statusChartData} options={chartOptions} />
          </ChartCard>
          
          <ChartCard title="Request Status">
            <Doughnut data={requestStatusData} options={chartOptions} />
          </ChartCard>

          <ChartCard title="Weekly Activity">
            <Line data={activityChartData} options={chartOptions} />
          </ChartCard>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700">
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
        <EmptyState 
          Icon={EmptyStateIcon}
          itemType={itemType}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => renderCard(item))}
        </div>
      )}
    </div>
  );
};

// Helper components
const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02]">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700">
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
    <div className="h-56">
      {children}
    </div>
  </div>
);

const EmptyState = ({ Icon, itemType, searchQuery }) => (
  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700">
    <Icon className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3" />
    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
      No {itemType} found
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      {searchQuery ? 'Try a different search term' : `You currently have no ${itemType}`}
    </p>
  </div>
);

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((o, p) => (o || {})[p], obj);
};

export default Dashboard;