import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faDollarSign, 
  faChartBar, 
  faCheckCircle,
  faBell,
  faSearch,
  faCog,
  faUserCircle,
  faMoon,
  faSun,
  faPlus,
  faFileExport,
  faBullhorn,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import AdminPageTitle from "../../comman/AdminPageTitle";

ChartJS.register(...registerables);

const AdminDashboard = () => {


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

  const revenueData = {
    labels: ['Product A', 'Product B', 'Service C', 'Service D'],
    datasets: [{
      data: [12000, 8000, 3000, 1780],
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444'
      ]
    }]
  };

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'created new post', time: '10 mins ago' },
    { id: 2, user: 'Jane Smith', action: 'updated profile', time: '25 mins ago' },
    { id: 3, user: 'System', action: 'completed nightly backup', time: '2 hours ago' },
    { id: 4, user: 'Admin', action: 'updated settings', time: '4 hours ago' }
  ];

  return (
    <main className="p-6">
      <AdminPageTitle title="Admin Dashboard" />
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 ">
            <StatCard 
              icon={faUsers} 
              title="Total Users" 
              value="2,453" 
              trend="↑ 12% from last month" 
              color="blue" 
              
            />
            <StatCard 
              icon={faDollarSign} 
              title="Revenue" 
              value="$24,780" 
              trend="↑ 5% from last quarter" 
              color="green" 
            />
            <StatCard 
              icon={faChartBar} 
              title="Active Projects" 
              value="18" 
              trend="↓ 2 from last week" 
              color="yellow" 
            />
            <StatCard 
              icon={faCheckCircle} 
              title="System Health" 
              value="Optimal" 
              trend="Uptime: 99.9%" 
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
              <h2 className="text-lg font-semibold mb-4">Revenue Breakdown</h2>
              <Pie data={revenueData} />
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
                      <FontAwesomeIcon icon={faUserCircle} className="text-blue-500" />
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
                <button className="w-full flex items-center space-x-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800">
                  <FontAwesomeIcon icon={faPlus} className="text-blue-500" />
                  <span>Add New User</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-3 rounded-lg bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800">
                  <FontAwesomeIcon icon={faFileExport} className="text-green-500" />
                  <span>Generate Report</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800">
                  <FontAwesomeIcon icon={faBullhorn} className="text-yellow-500" />
                  <span>Send Announcement</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-3 rounded-lg bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800">
                  <FontAwesomeIcon icon={faDatabase} className="text-purple-500" />
                  <span>System Backup</span>
                </button>
              </div>
            </div>
          </div>
    </main>
  );
};


const StatCard = ({ icon, title, value, trend, color }) => {
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
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;