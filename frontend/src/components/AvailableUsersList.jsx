import { ErrorAlert } from "./common/Alert";
import LoadingSpinner from "./common/LoadingSpinner";
import UserCard from "./UserCard";
import { FaSearch } from "react-icons/fa";

const AvailableUsersList = ({
  users,
  userType,
  onSendRequest,
  loading,
  error,
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!users?.length)
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <FaSearch className="text-primary-light dark:text-primary-dark text-4xl" />
        </div>
        <p className="text-primary-light dark:text-primary-dark text-lg mb-2">
          No workers found
        </p>
        <p className="text-secondary-light dark:text-secondary-dark text-sm">
          Try adjusting your search or filters to find more workers
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          userType={userType}
          onSendRequest={onSendRequest}
        />
      ))}
    </div>
  );
};

export default AvailableUsersList;
