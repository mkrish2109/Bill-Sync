import { useState } from "react";
import RequestCard from "./RequestCard";

const RequestTabs = ({
  sentRequests = [],
  receivedRequests = [],
  onAccept,
  onReject,
  userType,
}) => {
  const [activeTab, setActiveTab] = useState(
    userType === "worker" ? "received" : "sent"
  );

  // Only show tabs if both sent and received requests exist
  const showTabs =
    userType === "buyer"
      ? sentRequests.length > 0
      : receivedRequests.length > 0;

  return (
    <div>
      {showTabs && (
        <div className="flex border-b border-border-hoverLight dark:border-border-hoverDark mb-4">
          {userType === "worker" && (
            <button
              className={`px-4 py-2 font-medium transition-colors duration-200 ${
                activeTab === "received"
                  ? "text-text-secondaryLight dark:text-text-secondaryDark border-b-2 border-border-hoverLight dark:border-border-dark"
                  : "text-primary-light dark:text-primary-dark border-b-2 border-primary-light dark:border-primary-dark"
              }`}
              onClick={() => setActiveTab("received")}
            >
              Received ({receivedRequests.length})
            </button>
          )}
          {userType === "buyer" && (
            <button
              className={`px-4 py-2 font-medium transition-colors duration-200 ${
                activeTab === "sent"
                  ? "text-text-secondaryLight dark:text-text-secondaryDark border-b-2 border-border-hoverLight dark:border-border-dark"
                  : "text-primary-light dark:text-primary-dark border-b-2 border-primary-light dark:border-primary-dark"
              }`}
              onClick={() => setActiveTab("sent")}
            >
              Sent ({sentRequests.length})
            </button>
          )}
        </div>
      )}

      <div>
        {userType === "worker" ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                type="received"
                onAccept={onAccept}
                onReject={onReject}
                userType={userType}
              />
            ))
          ) : (
            <div className="text-center py-8 text-secondary-light dark:text-secondary-dark">
              No received requests
            </div>
          )
        ) : sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              type="sent"
              userType={userType}
            />
          ))
        ) : (
          <div className="text-center py-8 text-secondary-light dark:text-secondary-dark">
            No sent requests
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTabs;
