import { Link } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../LoadingSpinner';

const FabricList = ({
  fabrics,
  loading,
  error,
  viewType = 'buyer', // 'buyer' or 'worker'
  onStatusChange,
  onDelete,
  onFilterChange,
  statusFilter,
  showAddButton = false
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="bg-error-base/10 text-error-base p-4 rounded">Error: {error}</div>;

  const statusColors = {
    assigned: 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark',
    'in-progress': 'bg-warning-base/20 text-warning-base dark:bg-warning-hover/20 dark:text-warning-hover',
    completed: 'bg-success-base/20 text-success-base dark:bg-success-hover/20 dark:text-success-hover',
    cancelled: 'bg-error-base/20 text-error-base dark:bg-error-hover/20 dark:text-error-hover'
  };
  

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
            <div 
              key={fabric._id} 
              className="bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Mobile/Tablet Header */}
              <div className="md:hidden p-4 border-b border-border-light dark:border-border-dark flex items-start gap-4">
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
              </div>

              {/* Desktop Header */}
              <div className="hidden md:flex p-4 border-b border-border-light dark:border-border-dark items-center gap-4">
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
                
                {viewType === 'buyer' ? (
                    <>
                  {/* <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">Quantity</p>
                      <p className="text-text-light dark:text-text-dark">
                        {fabric.quantity} {fabric.unit}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">Unit Price</p>
                      <p className="text-text-light dark:text-text-dark">
                        ${fabric.unitPrice?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">Total</p>
                      <p className="text-text-light dark:text-text-dark font-medium">
                        ${fabric.totalPrice?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div> */}
                    </>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">Quantity</p>
                      <p className="text-text-light dark:text-text-dark">
                        {fabric.quantity} {fabric.unit}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-secondary-light dark:text-secondary-dark">Assigned On</p>
                      <p className="text-secondary-light dark:text-secondary-dark">
                        {fabric.assignedAt 
                          ? new Date(fabric.assignedAt).toLocaleDateString() 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Link 
                    to={`/${viewType}/fabrics/${fabric._id}`}
                    className="bg-primary-light dark:bg-primary-dark hover:bg-primary-hoverLight dark:hover:bg-primary-hoverDark text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
                  >
                    <FaEye size={12} /> View
                  </Link>
                  
                  {viewType === 'buyer' && (
                    <>
                      <Link 
                        to={`/${viewType}/fabrics/edit/${fabric._id}`}
                        className="bg-warning-base hover:bg-warning-hover text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
                      >
                        <FaEdit size={12} /> Edit
                      </Link>
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

              {/* Content Area */}
              <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {viewType === 'buyer' ? (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Assigned Worker(s)</h3>
                      {fabric.workers?.length > 0 ? (
                        <div className="space-y-3">
                          {fabric.workers.map((worker, index) => (
                            <div key={index} className="bg-surface-light dark:bg-surface-dark p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-text-light dark:text-text-dark">{worker.name}</p>
                                  <p className="text-sm text-secondary-light dark:text-secondary-dark">{worker.contact}</p>
                                </div>
                                <span 
                                  className={`inline-block px-3 py-1 text-xs rounded-full capitalize ${statusColors[worker.status] || 'bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark'}`}
                                >
                                  {worker.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-secondary-light dark:text-secondary-dark">Not assigned</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Fabric Details</h3>
                      <div className="grid md:grid-cols-3 grid-cols-2  gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-md">
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
                        <p className="font-medium text-text-light dark:text-text-dark">{fabric.buyerId?.name || 'N/A'}</p>
                        {fabric.buyerId?.company && (
                          <p className="text-sm text-secondary-light dark:text-secondary-dark mt-1">{fabric.buyerId.company}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">Status</h3>
                      <div className="bg-surface-light dark:bg-surface-dark rounded-md">
                        {onStatusChange ? (
                          <select
                            value={fabric.assignmentStatus}
                            onChange={(e) => onStatusChange(fabric._id, fabric.assignmentId, e.target.value)}
                            className={`w-full p-3 text-sm rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark ${statusColors[fabric.assignmentStatus] || 'bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark'} focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent`}
                          >
                            <option value="assigned">Assigned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 text-sm rounded-md ${statusColors[fabric.assignmentStatus] || 'bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark'}`}>
                            {fabric.assignmentStatus}
                          </span>
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

              {/* Mobile Actions */}
              <div className="md:hidden p-4 border-t border-border-light dark:border-border-dark flex flex-wrap gap-2">
                <Link 
                  to={`/${viewType}/fabrics/${fabric._id}`}
                  className="bg-primary-light dark:bg-primary-dark hover:bg-primary-hoverLight dark:hover:bg-primary-hoverDark text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200 flex-1 justify-center"
                >
                  <FaEye size={12} /> View
                </Link>
                
                {viewType === 'buyer' && (
                  <>
                    <Link 
                      to={`/${viewType}/fabrics/edit/${fabric._id}`}
                      className="bg-warning-base hover:bg-warning-hover text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200 flex-1 justify-center"
                    >
                      <FaEdit size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => onDelete(fabric._id)}
                      className="bg-error-base hover:bg-error-hover text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors duration-200 flex-1 justify-center"
                    >
                      <FaTrash size={12} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FabricList;