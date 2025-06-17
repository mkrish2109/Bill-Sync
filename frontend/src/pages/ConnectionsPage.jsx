import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhone, FaBuilding, FaBriefcase, FaSort } from "react-icons/fa";
import { api } from "../helper/apiHelper";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/Alert";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "flowbite-react";
import { PageMeta } from "../components/common/PageMeta";
import SearchInput from "../components/common/SearchInput";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name' or 'date'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const filterAndSortConnections = useCallback(() => {
    let filtered = [...connections];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(
        ({ user }) =>
          user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a?.user?.name.toLowerCase();
        const nameB = b?.user?.name.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortBy === "date") {
        const dateA = a?.requestHistory[0]?.createdAt || 0;
        const dateB = b?.requestHistory[0]?.createdAt || 0;
        return sortOrder === "asc"
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
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await api.get("/requests/connections");
      if (response.data.success) {
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert />;
  }
  return (
    <>
      <PageMeta
        title="Connections | Bill Sync - Manage Your Professional Network"
        description="View and manage your professional connections on Bill Sync. Stay connected with your network of workers and businesses."
        keywords="professional connections, network management, business connections, worker connections, connection tracking"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            Connected {role === "worker" ? "Buyers" : "Workers"}
          </h1>

          <div className="flex gap-4">
            {/* Search Input */}
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name or contact..."
            />

            {/* Sort Buttons */}
            <div className="flex gap-2">
              <Button
                color="primary"
                onClick={() => toggleSort("name")}
                className="flex items-center gap-2 px-4 py-2"
              >
                <FaSort />
                <span>Name</span>
                {sortBy === "name" && (
                  <span className="text-xs">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </Button>
              <Button
                color="secondary"
                onClick={() => toggleSort("date")}
                className="flex items-center gap-2 px-4 py-2"
              >
                <FaSort />
                <span>Date</span>
                {sortBy === "date" && (
                  <span className="text-xs">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {filteredConnections.length === 0 ? (
          <div className="text-center py-8 text-text-secondaryLight dark:text-secondary-dark">
            {connections.length === 0 ? (
              <>
                No connections yet.{" "}
                {role === "buyer" && (
                  <button
                    onClick={() => navigate("/buyer/network")}
                    className="text-primary-light dark:text-primary-dark hover:text-primary-hoverLight dark:hover:text-primary-hoverDark ml-1"
                  >
                    Find workers
                  </button>
                )}
              </>
            ) : (
              "No connections match your search criteria"
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map(({ user, requestHistory }) => (
              <div
                key={user._id}
                className="bg-background-light dark:bg-background-dark rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="rounded-full mr-4">
                    <img
                      src={user.profilePicture || "/images/profile.webp"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">
                      {user.name}
                    </h3>
                    <div className="flex items-center text-text-light dark:text-text-dark text-sm">
                      <FaPhone className="mr-1" />
                      <span className="text-text-mutedLight dark:text-text-mutedDark">
                        {user.contact}
                      </span>
                    </div>
                  </div>
                </div>

                {role === "worker" ? (
                  <div className="flex items-center  mb-4">
                    <FaBuilding className="mr-2 text-text-light dark:text-text-dark" />
                    <span className="text-text-mutedLight dark:text-text-mutedDark">
                      {user.company}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-text-light dark:text-text-dark mb-4">
                    <FaBriefcase className="mr-2" />
                    <span className="text-text-mutedLight dark:text-text-mutedDark">
                      {user.experience}
                    </span>
                  </div>
                )}

                {user.skills && (
                  <div className="mb-4 flex gap-2 items-center ">
                    <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                      Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-hoverLight dark:bg-primary-hoverDark text-text-mutedLight dark:text-text-mutedDark text-xs px-2 py-1 rounded"
                        >
                          hello,ghfasytdfkj
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border-activeLight dark:border-border-activeDark pt-4 flex gap-2">
                  <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                    Recent Activity:
                  </h4>
                  <div className="space-y-2">
                    {requestHistory.slice(0, 3).map((request) => (
                      <div
                        key={request._id}
                        className="text-sm text-text-mutedLight dark:text-text-mutedDark"
                      >
                        <StatusBadge status={request.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ConnectionsPage;
