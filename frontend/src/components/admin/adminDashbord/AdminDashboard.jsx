import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import AdminPageTitle from "../../common/AdminPageTitle";
import { PageMeta } from "../../common/PageMeta";
import {
  HiUsers,
  HiShoppingBag,
  HiChartBar,
  HiCheckCircle,
  HiUserCircle,
  HiDocumentDownload,
  HiSpeakerphone,
  HiDatabase,
} from "react-icons/hi";
import { FaUsersCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../services/apiServices";
import { api } from "../../../helper/apiHelper";
import LoadingSpinner from "../../common/LoadingSpinner";

// Lazy load chart components with dynamic import
const Line = lazy(() =>
  import("react-chartjs-2").then((mod) => ({ default: mod.Line }))
);
const Pie = lazy(() =>
  import("react-chartjs-2").then((mod) => ({ default: mod.Pie }))
);

ChartJS.register(...registerables);

// Static chart options for Line chart
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        color: "#1A1A1A", // text-light color
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        color: "#1A1A1A", // text-light color
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        color: "#1A1A1A", // text-light color
      },
    },
  },
};

// Static chart options for Pie chart
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        color: "#1A1A1A", // text-light color
      },
    },
  },
};

// Dark mode chart options for Line chart
const darkLineChartOptions = {
  ...lineChartOptions,
  plugins: {
    ...lineChartOptions.plugins,
    legend: {
      ...lineChartOptions.plugins.legend,
      labels: {
        ...lineChartOptions.plugins.legend.labels,
        color: "#F5F5F5", // text-dark color
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "#F5F5F5", // text-dark color
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "#F5F5F5", // text-dark color
      },
    },
  },
};

// Dark mode chart options for Pie chart
const darkPieChartOptions = {
  ...pieChartOptions,
  plugins: {
    ...pieChartOptions.plugins,
    legend: {
      ...pieChartOptions.plugins.legend,
      labels: {
        ...pieChartOptions.plugins.legend.labels,
        color: "#F5F5F5", // text-dark color
      },
    },
  },
};

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

// Memoized StatCard component
const StatCard = React.memo(({ icon: Icon, title, value, trend, color }) => {
  const colorClasses = {
    blue: "text-primary-light dark:text-primary-dark bg-background-surfaceLight dark:bg-background-surfaceDark",
    green:
      "text-success-base dark:text-success-base bg-background-surfaceLight dark:bg-background-surfaceDark",
    yellow:
      "text-warning-base dark:text-warning-base bg-background-surfaceLight dark:bg-background-surfaceDark",
    red: "text-error-base dark:text-error-base bg-background-surfaceLight dark:bg-background-surfaceDark",
  };

  return (
    <div className="p-6 rounded-lg shadow bg-background-surfaceLight dark:bg-background-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1 text-text-light dark:text-text-dark">
            {value}
          </p>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-1">
            {trend}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
});

// Add ErrorBoundary component at the top level
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-error-base">Failed to load chart</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Modify ChartCard component
const ChartCard = React.memo(({ title, children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 rounded-lg shadow bg-background-light dark:bg-background-dark">
      <h2 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">
        {title}
      </h2>
      <div className="h-[300px]">
        <ChartErrorBoundary>
          {isLoading ? (
           <LoadingSpinner/>
          ) : (
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
                </div>
              }
            >
              {children}
            </Suspense>
          )}
        </ChartErrorBoundary>
      </div>
    </div>
  );
});

// Memoized ActivityItem component
const ActivityItem = React.memo(({ user, action, time }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
      <HiUserCircle className="text-secondary-light dark:text-secondary-dark text-xl" />
    </div>
    <div>
      <p className="font-medium text-text-light dark:text-text-dark">{user}</p>
      <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
        {action} · {time}
      </p>
    </div>
  </div>
));

// Memoized QuickActionButton component
const QuickActionButton = React.memo(({ icon: Icon, text, color, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-2 p-3 rounded-lg ${color} hover:opacity-90 transition-opacity`}
  >
    <Icon className="text-xl" />
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
    completedAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [fabricData, setFabricData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users data
        const usersResponse = await getAllUsers();
        console.log("Fetched users:", usersResponse.data);
        const users = usersResponse.data;
        setUserData(users);

        // Fetch fabrics data
        const fabricsResponse = await api.get("/fabrics/all");
        console.log("Fetched fabrics:", fabricsResponse.data.data);
        const fabrics = fabricsResponse.data.data;
        setFabricData(fabrics);

        // Calculate user growth data
        const userGrowthData = calculateUserGrowthData(users);

        // Process recent activity from user data
        const activities = processRecentActivity(users);
        setRecentActivity(activities);

        // Calculate fabric statistics
        const fabricStats = calculateFabricStats(fabrics);

        // Update stats
        setStats({
          totalUsers: users.length,
          totalFabrics: fabrics.length,
          activeAssignments: fabricStats.activeAssignments,
          completedAssignments: fabricStats.completedAssignments,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Listen for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Function to calculate user growth data
  const calculateUserGrowthData = (users) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Initialize data array with zeros up to current month
    const monthlyData = new Array(currentMonth + 1).fill(0);

    // Count users created in each month up to current month
    users.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      if (
        createdAt.getFullYear() === currentYear &&
        createdAt.getMonth() <= currentMonth
      ) {
        monthlyData[createdAt.getMonth()]++;
      }
    });

    return {
      labels: months.slice(0, currentMonth + 1),
      datasets: [
        {
          label: "New Users",
          data: monthlyData,
          borderColor: isDarkMode ? "#D4B483" : "#7A4F2A", // primary-dark : primary-light
          backgroundColor: isDarkMode
            ? "rgba(212, 180, 131, 0.1)"
            : "rgba(122, 79, 42, 0.1)", // primary-dark : primary-light with opacity
          tension: 0.3,
        },
      ],
    };
  };

  // Function to process recent activity from user data
  const processRecentActivity = (users) => {
    const activities = [];

    // Sort users by last update time
    const sortedUsers = [...users].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Get the 5 most recent activities
    sortedUsers.slice(0, 5).forEach((user) => {
      const timeAgo = getTimeAgo(new Date(user.updatedAt));
      activities.push({
        id: user._id,
        user: `${user.fname} ${user.lname}`,
        action: getActivityAction(user),
        time: timeAgo,
      });
    });

    return activities;
  };

  // Helper function to get time ago string
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  // Helper function to determine activity action based on user data
  const getActivityAction = (user) => {
    if (user.role === "worker") {
      return "updated worker profile";
    } else if (user.role === "buyer") {
      return "updated buyer profile";
    } else if (user.role === "admin") {
      return "updated admin settings";
    }
    return "updated profile";
  };

  // Function to calculate fabric statistics
  const calculateFabricStats = (fabrics) => {
    const stats = {
      activeAssignments: 0,
      inProgress: 0,
      completedAssignments: 0,
    };
    console.log("calculateFabricStats", fabrics);
    fabrics.forEach((fabric) => {
      if (fabric.assignments.status === "assigned") {
        stats.activeAssignments++;
      } else if (fabric.assignments.stats === "in-progress") {
        stats.inProgress++;
      } else if (fabric.assignments.status === "completed") {
        stats.completedAssignments++;
      }
    });
    stats.totalFabrics = fabrics.length;
    console.log("Fabric stats:", stats);

    return stats;
  };

  // Update chart data to include fabric status
  const chartData = useMemo(
    () => ({
      userGrowthData: calculateUserGrowthData(userData),
      fabricStatusData: {
        labels: ["Pending", "In Progress", "Completed", "Cancelled"],
        datasets: [
          {
            data: [
              fabricData.filter((f) => f.assignments.status === "assigned")
                .length,
              fabricData.filter((f) => f.assignments.status === "in-progress")
                .length,
              fabricData.filter((f) => f.assignments.status === "completed")
                .length,
              fabricData.filter((f) => f.assignments.status === "cancelled")
                .length,
            ],
            backgroundColor: [
              "#f59e0b", // yellow
              "#3b82f6", // blue
              "#10b981", // green
              "#ef4444", // red
            ],
          },
        ],
      },
    }),
    [userData, fabricData]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Admin Dashboard | Bill Sync - System Administration"
        description="Manage your Bill Sync platform with comprehensive admin controls. Monitor users, track system performance, and maintain platform operations."
        keywords="admin dashboard, system administration, platform management, user management, system monitoring"
      />
      <main className="p-6">
        <AdminPageTitle title="Admin Dashboard" />

        {error && (
          <div className="mb-6 p-4 bg-warning-base/10 text-warning-base rounded-lg">
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
            className="w-full mb-6 p-3 bg-background-surfaceLight dark:bg-background-surfaceDark rounded-lg text-text-light dark:text-text-dark font-medium"
          >
            Show Charts
          </button>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard title="User Growth">
              <Line
                data={chartData.userGrowthData}
                options={isDarkMode ? darkLineChartOptions : lineChartOptions}
              />
            </ChartCard>
            <ChartCard title="Fabric Status Distribution">
              <Pie
                data={chartData.fabricStatusData}
                options={isDarkMode ? darkPieChartOptions : pieChartOptions}
              />
            </ChartCard>
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="p-6 rounded-lg shadow bg-background-light dark:bg-background-dark lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <ActivityItem
                    key={item.id}
                    user={item.user}
                    action={item.action}
                    time={item.time}
                  />
                ))
              ) : (
                <p className="text-text-secondaryLight dark:text-text-secondaryDark">
                  No recent activity to display
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-lg shadow bg-background-light dark:bg-background-dark">
            <h2 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickActionButton
                icon={FaUsersCog}
                text="Manage Users"
                color="bg-primary-light dark:bg-primary-dark text-text-dark dark:text-text-light"
                onClick={() => navigate("/admin/users")}
              />
              <QuickActionButton
                icon={HiDocumentDownload}
                text="View Fabrics"
                color="bg-success-base dark:bg-success-base text-text-dark dark:text-text-light"
                onClick={() => navigate("/admin/fabrics")}
              />
              <QuickActionButton
                icon={HiSpeakerphone}
                text="Manage Assignments"
                color="bg-warning-base dark:bg-warning-base text-text-dark dark:text-text-light"
                onClick={() => navigate("/admin/assignments")}
              />
              <QuickActionButton
                icon={HiDatabase}
                text="System Settings"
                color="bg-info-base dark:bg-info-base text-text-dark dark:text-text-light"
                onClick={() => navigate("/admin/settings")}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(AdminDashboard);
