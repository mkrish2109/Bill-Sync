import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import AdminPageTitle from "../../common/AdminPageTitle";
import { PageMeta } from '../../common/PageMeta';
import { 
  HiUsers, 
  HiShoppingBag, 
  HiChartBar, 
  HiCheckCircle,
  HiUserCircle,
  HiDocumentDownload,
  HiSpeakerphone,
  HiDatabase
} from "react-icons/hi";
import { FaUsersCog } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// Lazy load chart components with dynamic import
const Line = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })));
const Pie = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Pie })));

ChartJS.register(...registerables);

// Static chart options
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
    }
  }
};

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

// Memoized StatCard component
const StatCard = React.memo(({ icon: Icon, title, value, trend, color }) => {
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
});

// Memoized ChartCard component with intersection observer
const ChartCard = React.memo(({ title, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {isVisible && (
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
          </div>
        }>
          {children}
        </Suspense>
      )}
    </div>
  );
});

// Memoized ActivityItem component
const ActivityItem = React.memo(({ user, action, time }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
      <HiUserCircle className="text-blue-500 text-xl" />
    </div>
    <div>
      <p className="font-medium">{user}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{action} · {time}</p>
    </div>
  </div>
));

// Memoized QuickActionButton component
const QuickActionButton = React.memo(({ icon: Icon, text, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-2 p-3 rounded-lg ${color} hover:opacity-90 transition-opacity`}
  >
    <Icon className={`text-${color.split('-')[1]}-500 text-xl`} />
    <span>{text}</span>
  </button>
));

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showMobileCharts, setShowMobileCharts] = useState(false);
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

  // Memoize chart data
  const chartData = useMemo(() => ({
    userGrowthData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Users',
        data: [120, 190, 170, 220, 250, 300],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      }]
    },
    fabricStatusData: {
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
    }
  }), [stats.activeAssignments, stats.completedAssignments]);

  // Memoize recent activity data
  const recentActivity = useMemo(() => [
    { id: 1, user: 'John Doe', action: 'created new fabric', time: '10 mins ago' },
    { id: 2, user: 'Jane Smith', action: 'updated profile', time: '25 mins ago' },
    { id: 3, user: 'System', action: 'completed nightly backup', time: '2 hours ago' },
    { id: 4, user: 'Admin', action: 'updated settings', time: '4 hours ago' }
  ], []);

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
      {isMobile && !showMobileCharts ? (
        <button
          onClick={() => setShowMobileCharts(true)}
          className="w-full mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium"
        >
          Show Charts
        </button>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="User Growth">
            <Line data={chartData.userGrowthData} options={chartOptions} />
          </ChartCard>
          <ChartCard title="Fabric Status Distribution">
            <Pie data={chartData.fabricStatusData} options={chartOptions} />
          </ChartCard>
        </div>
      )}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark lg:col-span-2`}>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(item => (
              <ActivityItem
                key={item.id}
                user={item.user}
                action={item.action}
                time={item.time}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-lg shadow bg-background-light dark:bg-background-dark`}>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionButton
              icon={FaUsersCog}
              text="Manage Users"
              color="bg-blue-100 dark:bg-blue-900"
              onClick={() => navigate('/admin/users')}
            />
            <QuickActionButton
              icon={HiDocumentDownload}
              text="View Fabrics"
              color="bg-green-100 dark:bg-green-900"
              onClick={() => navigate('/admin/fabrics')}
            />
            <QuickActionButton
              icon={HiSpeakerphone}
              text="Manage Assignments"
              color="bg-yellow-100 dark:bg-yellow-900"
              onClick={() => navigate('/admin/assignments')}
            />
            <QuickActionButton
              icon={HiDatabase}
              text="System Settings"
              color="bg-purple-100 dark:bg-purple-900"
              onClick={() => navigate('/admin/settings')}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default React.memo(AdminDashboard);