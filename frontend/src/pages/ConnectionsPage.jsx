import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaBuilding, FaBriefcase, FaSearch, FaSort } from 'react-icons/fa';
import { api } from '../helper/apiHelper';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/Alert';
import { StatusBadge } from '../components/common/StatusBadge';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'date'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const filterAndSortConnections = useCallback(() => {
    let filtered = [...connections];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(({ user }) =>
        user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a?.user?.name.toLowerCase();
        const nameB = b?.user?.name.toLowerCase();
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortBy === 'date') {
        const dateA = a?.requestHistory[0]?.createdAt || 0;
        const dateB = b?.requestHistory[0]?.createdAt || 0;
        return sortOrder === 'asc' 
          ? new Date(dateA) - new Date(dateB)
          : new Date(dateB) - new Date(dateA);
      }
      return 0;
    });

    setFilteredConnections(filtered);
  }, [searchTerm, sortBy, sortOrder, connections]);

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    filterAndSortConnections();
  }, [searchTerm, sortBy, sortOrder, connections, filterAndSortConnections]);

  const toggleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests/connections');
      if(response.data.success){
        console.log(response?.data?.data?.connections)
        setConnections(response?.data?.data?.connections);
        setFilteredConnections(response?.data?.data?.connections);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <ErrorAlert/>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Connected {role === 'worker' ? 'Buyers' : 'Workers'}
        </h1>
        
        <div className="flex gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort('name')}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                sortBy === 'name' ? 'bg-blue-50 text-blue-600' : 'bg-white'
              }`}
            >
              <FaSort />
              <span>Name</span>
              {sortBy === 'name' && (
                <span className="text-xs">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <button
              onClick={() => toggleSort('date')}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                sortBy === 'date' ? 'bg-blue-50 text-blue-600' : 'bg-white'
              }`}
            >
              <FaSort />
              <span>Date</span>
              {sortBy === 'date' && (
                <span className="text-xs">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {filteredConnections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {connections.length === 0 ? (
            <>
              No connections yet. {role === 'buyer' && (
                <button 
                  onClick={() => navigate('/buyer/network')}
                  className="text-blue-500 hover:text-blue-600 ml-1"
                >
                  Find workers
                </button>
              )}
            </>
          ) : (
            'No connections match your search criteria'
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConnections.map(({ user, requestHistory }) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <FaUser className="text-gray-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaPhone className="mr-1" />
                    <span>{user.contact}</span>
                  </div>
                </div>
              </div>
              
              {role === 'worker' ? (
                <div className="flex items-center text-gray-600 mb-4">
                  <FaBuilding className="mr-2" />
                  <span>{user.company}</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600 mb-4">
                  <FaBriefcase className="mr-2" />
                  <span>{user.experience}</span>
                </div>
              )}
              
              {user.skills && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity:</h4>
                <div className="space-y-2">
                  {requestHistory.slice(0, 3).map((request) => (

                    <div 
                      key={request._id}
                      className="text-sm text-gray-600"
                    >
                      <StatusBadge status={request.status} size='sm'/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage; 