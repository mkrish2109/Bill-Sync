import React, { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { FaBox, FaPlus } from "react-icons/fa";
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
} from "chart.js";
import StatusFilter from "../common/StatusFilter";
import SearchInput from "../common/SearchInput";
import { ErrorAlert } from "../common/Alert";
import LoadingSpinner from "../common/LoadingSpinner";
import { Button } from "flowbite-react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

// Lazy load chart components with dynamic import
const Line = lazy(() =>
  import("react-chartjs-2").then((mod) => ({ default: mod.Line }))
);
const Doughnut = lazy(() =>
  import("react-chartjs-2").then((mod) => ({ default: mod.Doughnut }))
);

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

// Separate chart options
const chartOptions = {
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
      },
    },
  },
  elements: {
    arc: {
      borderRadius: 4,
    },
  },
};

// Memoized StatCard component
const StatCard = React.memo(({ label, value, color }) => (
  <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-xs border border-border-light dark:border-border-dark transition-transform hover:scale-[1.02]">
    <h3 className="text-sm font-medium text-text-secondaryLight dark:text-text-dark mb-1">
      {label}
    </h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
));

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
    <div
      ref={cardRef}
      className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-xs border border-border-light dark:border-border-dark"
    >
      <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-3">
        {title}
      </h3>
      <div className="h-56">
        {isVisible && (
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        )}
      </div>
    </div>
  );
});

// Memoized EmptyState component
const EmptyState = React.memo(({ Icon, itemType, searchQuery }) => (
  <div className="text-center py-12 bg-background-light dark:bg-background-dark rounded-lg shadow-xs border border-border-light dark:border-border-dark">
    <Icon className="mx-auto text-4xl text-text-secondaryLight dark:text-text-secondaryDark mb-3" />
    <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
      No {itemType} found
    </h3>
    <p className="text-text-secondaryLight dark:text-text-dark">
      {searchQuery
        ? "Try a different search term"
        : `You currently have no ${itemType}`}
    </p>
  </div>
));

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((o, p) => (o || {})[p], obj);
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

const Dashboard = ({
  title,
  items,
  loading,
  error,
  setError,
  itemType = "items",
  statusKey = "status",
  searchKeys = ["name"],
  statusOptions = ["all", "assigned", "in-progress", "completed"],
  renderCard,
  emptyStateIcon: EmptyStateIcon = FaBox,
  onAddNew,
  addNewLabel = "Add New",
  showAddButton = true,
  showCharts = true,
  userRequests = {
    pending: 0,
    accepted: 0,
    rejected: 0,
  },
}) => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [showMobileCharts, setShowMobileCharts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Show 9 items per page (3x3 grid)

  // Memoize status counts calculation
  const statusCounts = useMemo(
    () =>
      items.reduce((acc, item) => {
        const status = item[statusKey] || "unassigned";
        acc[status] = (acc[status] || 0) + 1;
        acc.total = (acc.total || 0) + 1;
        return acc;
      }, {}),
    [items, statusKey]
  );

  // Memoize filtered items
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const statusMatch =
          filter === "all" || (item[statusKey] || "unassigned") === filter;

        const searchMatch =
          searchQuery === "" ||
          searchKeys.some((key) => {
            const value = getNestedValue(item, key) || "";
            return value
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          });

        return statusMatch && searchMatch;
      }),
    [items, filter, searchQuery, statusKey, searchKeys]
  );

  // Memoize paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Memoize chart data
  const chartData = useMemo(
    () => ({
      statusChartData: {
        labels: ["Assigned", "In Progress", "Completed", "Cancelled"],
        datasets: [
          {
            data: [
              statusCounts.assigned || 0,
              statusCounts["in-progress"] || 0,
              statusCounts.completed || 0,
              statusCounts.cancelled || 0,
            ],
            backgroundColor: [
              "rgba(245, 158, 11, 0.7)",
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(239, 68, 68, 0.7)",
            ],
            borderColor: [
              "rgba(245, 158, 11, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(239, 68, 68, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      requestStatusData: {
        labels: ["Pending", "Accepted", "Rejected"],
        datasets: [
          {
            data: [
              userRequests.pending || 0,
              userRequests.accepted || 0,
              userRequests.rejected || 0,
            ],
            backgroundColor: [
              "rgba(245, 158, 11, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(239, 68, 68, 0.7)",
            ],
            borderColor: [
              "rgba(245, 158, 11, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(239, 68, 68, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      activityChartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "New Items",
            data: items.reduce((acc, item) => {
              const date = new Date(item.fabric.createdAt);
              const dayIndex = date.getDay();
              acc[dayIndex]++;
              return acc;
            }, new Array(7).fill(0)),
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Completed",
            data: items.reduce((acc, item) => {
              if (item.status === "completed") {
                const date = new Date(item.fabric.createdAt);
                const dayIndex = date.getDay();
                acc[dayIndex]++;
              }
              return acc;
            }, new Array(7).fill(0)),
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
    }),
    [statusCounts, userRequests, items]
  );

  if (loading) return <LoadingSpinner  />;
  if (error)
    return <ErrorAlert error={error} onDismiss={() => setError(null)} />;

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <span className="text-2xl font-bold text-text-light dark:text-text-dark">
            {title}
          </span>

          {showAddButton && (
            <Button
              color="secondary"
              onClick={onAddNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
            >
              <FaPlus className="text-sm" />
              {addNewLabel}
            </Button>
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
            value={statusCounts["in-progress"] || 0}
            color="text-orange-500"
          />
          <StatCard
            label="Completed"
            value={statusCounts.completed || 0}
            color="text-success-base dark:text-success-dark"
          />
        </div>

        {/* Request Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Pending Requests"
            value={userRequests.pending || 0}
            color="text-secondary-light dark:text-text-secondaryDark"
          />
          <StatCard
            label="Accepted Requests"
            value={userRequests.accepted || 0}
            color="text-success-base dark:text-success-dark"
          />
          <StatCard
            label="Rejected Requests"
            value={userRequests.rejected || 0}
            color="text-error-base dark:text-error-dark"
          />
        </div>

        {/* Charts Section */}
        {showCharts && (
          <>
            {isMobile && !showMobileCharts && (
              <button
                onClick={() => setShowMobileCharts(true)}
                className="w-full mb-4 p-3 bg-background-surfaceLight dark:bg-background-surfaceDark rounded-lg text-text-light dark:text-text-dark font-medium hover:bg-surface-hoverLight dark:hover:bg-surface-hoverDark"
              >
                Show Charts
              </button>
            )}
            {(!isMobile || showMobileCharts) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <ChartCard title="Fabric Status">
                  <Doughnut
                    data={chartData.statusChartData}
                    options={chartOptions}
                  />
                </ChartCard>

                <ChartCard title="Request Status">
                  <Doughnut
                    data={chartData.requestStatusData}
                    options={chartOptions}
                  />
                </ChartCard>

                <ChartCard title="Weekly Activity">
                  <Line
                    data={chartData.activityChartData}
                    options={chartOptions}
                  />
                </ChartCard>
              </div>
            )}
          </>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-xs border border-border-light dark:border-border-dark">
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((item) => renderCard(item))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  color="secondary"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious />
                </Button>
                <span className="text-text-light dark:text-text-dark">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  color="secondary"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <GrFormNext />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(Dashboard);
