import { useState } from 'react';
import AvailableUsersList from '../components/AvailableUsersList';
import { useAvailableWorkers } from '../hooks/useRequests';
import { FaSearch, FaSort } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/Alert';

const NetworkPage = () => {
  const role = localStorage.getItem('role');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'experience'
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const {
    availableUsers,
    loading,
    error,
    sendRequest
  } = useAvailableWorkers();
console.log(availableUsers)
  // Filter and sort users
  const filteredUsers = (availableUsers?.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.experience && user.experience.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [])
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'experience') {
        const expA = a.experience || '';
        const expB = b.experience || '';
        return sortOrder === 'asc'
          ? expA.localeCompare(expB)
          : expB.localeCompare(expA);
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  if (role !== 'buyer') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p>Only buyers can access this page. Workers can view and respond to requests in the Requests page.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find Workers</h1>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Workers</h2>
          
          <div className="flex gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search workers..."
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
                onClick={() => toggleSort('experience')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  sortBy === 'experience' ? 'bg-blue-50 text-blue-600' : 'bg-white'
                }`}
              >
                <FaSort />
                <span>Experience</span>
                {sortBy === 'experience' && (
                  <span className="text-xs">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <AvailableUsersList
          users={paginatedUsers}
          userType={role}
          onSendRequest={sendRequest}
          loading={loading}
          error={error}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkPage;