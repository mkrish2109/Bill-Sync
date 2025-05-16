import { useEffect, useState } from "react";
import { Select, Button, Spinner, Alert } from "flowbite-react";
import { api } from "../../../helper/apiHelper";
import { PageMeta } from "../../comman/PageMeta";
import { getAllUsers } from "../../../services/apiServices";
import { toast } from "react-toastify";
import { HiTrash } from "react-icons/hi";

function UsersListAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.map(user => ({
        ...user,
        fullName: `${user.fname} ${user.lname}`
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(
        `/admin/update-role/${userId}`, 
        { role: newRole },
        { withCredentials: true }
      );
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error("Error updating role", error);
      setError("Failed to update user role");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await api.delete(`/admin/users/${userId}`, { withCredentials: true });
        toast.success(response.message || "User deleted successfully");
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        console.error("Delete error:", error);
        setError("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert color="failure" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="All Users | Tex Bill"
        description="User profile dashboard for Tex Bill application"
      />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Users Management
          </h3>
        </div>

        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No users found
            </div>
          ) : (
            users.map((user) => (
              <div 
                key={user._id}
                className="p-4 flex items-center justify-between rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img
                      src="/images/profile.png"
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {user.role === "admin" ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Admin
                    </span>
                  ) : (
                    <Select
                      sizing="sm"
                      className="w-32"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="worker">Worker</option>
                    </Select>
                  )}
                  <Button
                    pill
                    size="xs"
                    color="red"
                    onClick={() => handleDelete(user._id)}
                  >
                    <HiTrash size= {16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default UsersListAdmin;