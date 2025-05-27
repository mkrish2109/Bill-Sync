import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import AdminPageTitle from "../../common/AdminPageTitle";
import { PageMeta } from '../../common/PageMeta';
import { api } from '../../../helper/apiHelper';
import { 
  HiUsers, 
  HiShoppingBag, 
  HiChartBar, 
  HiCheckCircle,
  HiUserCircle,
  HiPlus,
  HiDocumentDownload,
  HiSpeakerphone,
  HiDatabase
} from "react-icons/hi";
import { FaUsersCog } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

ChartJS.register(...registerables);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFabrics: 0,
    activeAssignments: 0,
    completedAssignments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Commented out API call until endpoint is ready
        // const response = await api.get('/admin/stats');
        // setStats(response.data);
        
        // Default data for development
        setStats({
          totalUsers: 150,
          totalFabrics: 75,
          activeAssignments: 12,
          completedAssignments: 63
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Unable to fetch statistics. Using default data.');
        // Set default data even if there's an error
        setStats({
          totalUsers: 150,
          totalFabrics: 75,
          activeAssignments: 12,
          completedAssignments: 63
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Users',
      data: [120, 190, 170, 220, 250, 300],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3
    }]
  };

  const fabricStatusData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [{
      data: [stats.activeAssignments, 15, stats.completedAssignments, 5],
      backgroundColor: [
        '#f59e0b', // yellow
        '#3b82f6', // blue
        '#10b981', // green
        '#ef4444'  // red
      ]
    }]
  };

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'created new fabric', time: '10 mins ago' },
    { id: 2, user: 'Jane Smith', action: 'updated profile', time: '25 mins ago' },
    { id: 3, user: 'System', action: 'completed nightly backup', time: '2 hours ago' },
    { id: 4, user: 'Admin', action: 'updated settings', time: '4 hours ago' }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
    </div>;
  }

  return (
    <main className="p-6">
      <PageMeta title="Admin Dashboard" />
      <AdminPageTitle title="Admin Dashboard" />
      
      {error && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          icon={HiUsers} 
          title="Total Users" 
          value={stats.totalUsers} 
          trend="Active users" 
          color="blue" 
        />
        <StatCard 
          icon={HiShoppingBag} 
          title="Total Fabrics" 
          value={stats.totalFabrics} 
          trend="Registered fabrics" 
          color="green" 
        />
        <StatCard 
          icon={HiChartBar} 
          title="Active Assignments" 
          value={stats.activeAssignments} 
          trend="In progress" 
          color="yellow" 
        />
        <StatCard 
          icon={HiCheckCircle} 
          title="Completed" 
          value={stats.completedAssignments} 
          trend="Successfully processed" 
          color="green" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark`}>
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <Line data={userGrowthData} />
        </div>
        <div className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark`}>
          <h2 className="text-lg font-semibold mb-4">Fabric Status Distribution</h2>
          <Pie data={fabricStatusData} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark lg:col-span-2`}>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(item => (
              <div key={item.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <HiUserCircle className="text-blue-500 text-xl" />
                </div>
                <div>
                  <p className="font-medium">{item.user}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.action} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark`}>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full flex items-center space-x-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <FaUsersCog className="text-blue-500 text-xl" />
              <span>Manage Users</span>
            </button>
            <button 
              onClick={() => navigate('/admin/fabrics')}
              className="w-full flex items-center space-x-2 p-3 rounded-lg bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800"
            >
              <HiDocumentDownload className="text-green-500 text-xl" />
              <span>View Fabrics</span>
            </button>
            <button 
              onClick={() => navigate('/admin/assignments')}
              className="w-full flex items-center space-x-2 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800"
            >
              <HiSpeakerphone className="text-yellow-500 text-xl" />
              <span>Manage Assignments</span>
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center space-x-2 p-3 rounded-lg bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800"
            >
              <HiDatabase className="text-purple-500 text-xl" />
              <span>System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

const StatCard = ({ icon: Icon, title, value, trend, color }) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900',
    green: 'text-green-500 bg-green-100 dark:bg-green-900',
    yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900',
    red: 'text-red-500 bg-red-100 dark:bg-red-900'
  };

  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trend}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;