import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../helper/apiHelper';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { 
  Select, 
  Button, 
  Badge, 
  Timeline, 
  TimelinePoint, 
  TimelineItem, 
  TimelineTime, 
  TimelineContent, 
  TimelineTitle, 
  TimelineBody 
} from 'flowbite-react';
import { 
  FaEdit, 
  FaTrash, 
  FaArrowLeft, 
  FaUser, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaHistory, 
  FaExchangeAlt 
} from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

// Reusable components
const ErrorAlert = ({ error, onDismiss }) => (
  <div className="bg-error-base/10 border-l-4 border-error-base text-error-base p-4 mb-4 rounded" role="alert">
    <p className="font-medium">{error}</p>
    {onDismiss && (
      <button 
        onClick={onDismiss} 
        className="mt-2 text-error-base hover:text-error-hover font-medium transition-colors duration-200"
      >
        Dismiss
      </button>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const badgeColors = {
    'assigned': 'primary',
    'in-progress': 'warning',
    'completed': 'success',
    'cancelled': 'failure',
    'default': 'secondary'
  };

  return (
    <Badge 
      color={badgeColors[status] || badgeColors.default} 
      className="inline-flex items-center capitalize px-3 py-1 rounded-full text-sm font-medium"
    >
      {status}
    </Badge>
  );
};

const HistoryItem = ({ item, field }) => {
  const getIcon = () => {
    switch (field) {
      case 'status':
        return FaExchangeAlt;
      default:
        return FaEdit;
    }
  };

  return (
    <TimelineItem key={item._id || item.changedAt}>
      <TimelinePoint icon={getIcon()} className="text-primary-light dark:text-primary-dark" />
      <TimelineContent>
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <TimelineTime className="text-xs text-secondary-light dark:text-secondary-dark mb-1 block">
            {new Date(item.changedAt).toLocaleString()}
          </TimelineTime>

          <TimelineTitle className="text-base font-semibold text-text-light dark:text-text-dark mb-2">
            {field === 'status' ? (
              <>
                Status changed from <StatusBadge status={item.previousStatus} /> to <StatusBadge status={item.newStatus} />
              </>
            ) : (
              <>
                {item.field} changed from <span className="font-mono bg-surface-light dark:bg-surface-dark px-1 py-0.5 rounded">{JSON.stringify(item.previousValue)}</span> 
                {' '}to <span className="font-mono bg-surface-light dark:bg-surface-dark px-1 py-0.5 rounded">{JSON.stringify(item.newValue)}</span>
              </>
            )}
          </TimelineTitle>

          {item.changedBy && (
            <TimelineBody className="text-sm text-secondary-light dark:text-secondary-dark mt-1">
              <span className="inline-flex items-center">
                <FaUser className="mr-1 text-primary-light dark:text-primary-dark" />
                <span className="font-medium">Changed by:</span> {item.changedBy.fname + " " + item.changedBy.lname || 'System'} ({item.changedBy.role || 'system'})
              </span>
            </TimelineBody>
          )}

          {item.notes && (
            <TimelineBody className="text-sm text-secondary-light dark:text-secondary-dark mt-1 italic">
              <span className="inline-flex items-center">
                <FaInfoCircle className="mr-1 text-primary-light dark:text-primary-dark" />
                <span className="font-medium">Notes:</span> {item.notes}
              </span>
            </TimelineBody>
          )}
        </div>
      </TimelineContent>
    </TimelineItem>
  );
};

const DetailsTab = ({ fabric }) => (
  <div className="space-y-6">
    <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Additional Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
        <h4 className="font-medium text-text-light dark:text-text-dark mb-3">Timestamps</h4>
        <div className="space-y-2">
          <p className="text-secondary-light dark:text-secondary-dark">
            <span className="font-medium">Created At:</span> {new Date(fabric.createdAt).toLocaleString()}
          </p>
          <p className="text-secondary-light dark:text-secondary-dark">
            <span className="font-medium">Updated At:</span> {new Date(fabric.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
      
      {fabric.notes && (
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
          <h4 className="font-medium text-text-light dark:text-text-dark mb-3">Notes</h4>
          <p className="text-secondary-light dark:text-secondary-dark">{fabric.notes}</p>
        </div>
      )}
    </div>
  </div>
);

const AssignmentsTab = ({ workers }) => (
  <div className="space-y-6">
    <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Worker Assignments</h3>
    <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark shadow-sm">
      <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
        <thead className="bg-surface-light dark:bg-surface-dark">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              Worker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
              Assigned Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-background-light dark:bg-background-dark divide-y divide-border-light dark:divide-border-dark">
          {workers?.map((worker, index) => (
            <tr key={index} className="hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-text-light dark:text-text-dark">{worker.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-light dark:text-secondary-dark">
                {worker.contact}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={worker.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-light dark:text-secondary-dark">
                {worker.assignedAt ? new Date(worker.assignedAt).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const HistoryTab = ({ statusHistory, changeHistory, loading }) => {
  if (loading) {
    return <div className="text-center py-8 text-secondary-light dark:text-secondary-dark">Loading history...</div>;
  }

  if (!statusHistory.length && !changeHistory.length) {
    return (
      <div className="text-center py-8 text-secondary-light dark:text-secondary-dark">
        No history available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Fabric History</h3>
      <Timeline>
        {statusHistory.length > 0 && (
          <>
            <TimelineItem>
              {/* <TimelinePoint icon={FaExchangeAlt} className="text-primary-light dark:text-primary-dark" /> */}
              <TimelineContent>
                <TimelineTitle className="text-lg font-semibold text-text-light dark:text-text-dark">
                  Status Changes
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            {statusHistory.map((item) => <HistoryItem key={item._id} item={item} field='status' />)}
          </>
        )}

        {changeHistory.length > 0 && (
          <>
            <TimelineItem>
              {/* <TimelinePoint icon={FaEdit} className="text-primary-light dark:text-primary-dark" /> */}
              <TimelineContent>
                <TimelineTitle className="text-lg font-semibold text-text-light dark:text-text-dark">
                  Data Changes
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            {changeHistory.map((item) => <HistoryItem key={item._id} item={item} />)}
          </>
        )}
      </Timeline>
    </div>
  );
};

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
      active 
        ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark' 
        : 'border-transparent text-secondary-light dark:text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark'
    }`}
  >
    <Icon className="mr-2" />
    {children}
  </button>
);

const FabricDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [statusHistory, setStatusHistory] = useState([]);
  const [changeHistory, setChangeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchFabricDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/fabrics/${id}?populate=all`);
        const fabricData = response.data.data;
        setFabric(fabricData);
        setStatusHistory(fabricData.statusHistory || []);
        setChangeHistory(fabricData.changeHistory || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFabricDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!fabric?.assignmentId) {
      setError('No assignment found for this fabric');
      return;
    }

    confirmAlert({
      title: 'Confirm status change',
      message: `Are you sure you want to change status to ${newStatus}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.put(`/assignments/update-status/${fabric.assignmentId}`, { 
                status: newStatus 
              });
              
              const fabricResponse = await api.get(`/fabrics/${id}`);
              setFabric(fabricResponse.data.data);
              
              setHistoryLoading(true);
              try {
                const historyResponse = await api.get(
                  `/assignments/${fabric.assignmentId}/history`
                );
                setStatusHistory(historyResponse.data.data);
              } catch (historyError) {
                console.error('Error fetching history:', historyError);
                setStatusHistory([]);
              } finally {
                setHistoryLoading(false);
              }
            } catch (err) {
              setError(err.message);
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleDelete = async () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this fabric? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/buyers/fabrics/${id}`);
              navigate('/buyer/fabrics');
            } catch (err) {
              setError(err.message);
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorAlert error={error} onDismiss={() => setError(null)} />;
  if (!fabric) return <div className="text-center py-8 text-text-light dark:text-text-dark">Fabric not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className="bg-secondary-light text-text-invertedLight hover:bg-secondary-hoverLight dark:bg-secondary-dark dark:hover:bg-secondary-hoverDark transition-colors duration-200 shadow focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Button>

        {user.role === 'buyer' && (
          <div className="flex space-x-2">
            {/* Edit Button */}
            <Link to={`/fabrics/edit/${fabric._id}`}>
              <Button
                className="bg-warning-base text-warning-text hover:bg-warning-hover dark:bg-warning-base dark:hover:bg-warning-hover transition-colors duration-200 shadow focus:ring-2 focus:ring-warning-base"
              >
                <FaEdit className="mr-2" /> Edit
              </Button>
            </Link>

            {/* Delete Button */}
            <Button
              onClick={handleDelete}
              className="bg-error-base text-error-text hover:bg-error-hover dark:bg-error-base dark:hover:bg-error-hover transition-colors duration-200 shadow focus:ring-2 focus:ring-error-base"
            >
              <FaTrash className="mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>



      <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-md overflow-hidden border border-border-light dark:border-border-dark">
        {/* Header with image and basic info */}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4 bg-surface-light dark:bg-surface-dark">
            <img 
              src={fabric.imageUrl} 
              alt={fabric.name} 
              className="w-full h-64 object-cover rounded-lg border border-border-light dark:border-border-dark shadow-sm"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/images/placeholder-fabric.jpg';
              }}
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">{fabric.name}</h1>
            <p className="text-secondary-light dark:text-secondary-dark mb-4">{fabric.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Buyer Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-text-light dark:text-text-dark">
                    <FaUser className="mr-2 text-secondary-light dark:text-secondary-dark" />
                    {fabric.buyerId?.name || 'N/A'}
                  </p>
                  {fabric.buyerId?.company && (
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">{fabric.buyerId?.company}</p>
                  )}
                  {fabric.buyerId?.contact && (
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">{fabric.buyerId.contact}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Fabric Specifications</h3>
                <div className="space-y-2">
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Quantity:</span> {fabric.quantity} {fabric.unit}
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Unit Price:</span> ${fabric.unitPrice?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Total Price:</span> ${fabric.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
            
            {fabric.assignmentStatus && (
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg mb-4 border border-border-light dark:border-border-dark">
                <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Current Status</h3>
                <div className="flex items-center">
                  <StatusBadge status={fabric.assignmentStatus} />
                  {user.role === 'worker' && (
                    <Select 
                      value={fabric.assignmentStatus}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      className="ml-3 w-40 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  )}
                </div>
                {fabric.assignedAt && (
                  <p className="text-sm text-secondary-light dark:text-secondary-dark mt-2 flex items-center">
                    <FaCalendarAlt className="mr-2" /> 
                    Assigned on: {new Date(fabric.assignedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs for additional information */}
        <div className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <div className="flex overflow-x-auto">
            <TabButton 
              active={activeTab === 'details'} 
              onClick={() => setActiveTab('details')}
              icon={FaInfoCircle}
            >
              Details
            </TabButton>
            
            {fabric.workers?.length > 0 && (
              <TabButton
                active={activeTab === 'assignments'}
                onClick={() => setActiveTab('assignments')}
                icon={FaUser}
              >
                Assignments
              </TabButton>
            )}

            {(statusHistory.length > 0 || changeHistory.length > 0) && (
              <TabButton
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                icon={FaHistory}
              >
                History
              </TabButton>
            )}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6 bg-background-light dark:bg-background-dark">
          {activeTab === 'details' && <DetailsTab fabric={fabric} />}
          {activeTab === 'assignments' && fabric.workers?.length > 0 && (
            <AssignmentsTab workers={fabric.workers} />
          )}
          {activeTab === 'history' && (
            <HistoryTab 
              statusHistory={statusHistory} 
              changeHistory={changeHistory} 
              loading={historyLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FabricDetails;