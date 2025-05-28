import {
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle
} from "flowbite-react";
import {  FaInfoCircle, FaUser } from "react-icons/fa";
import { StatusBadge } from "./StatusBadge";

const HistoryItem = ({ item, field }) => {
  // const getIcon = () => {
  //   switch (field) {
  //     case 'status':
  //       return FaExchangeAlt;
  //     default:
  //       return FaEdit;
  //   }
  // };

  return (
    <TimelineItem key={item._id || item.changedAt} className="mb-4 sm:mb-5">
      {/* <TimelinePoint icon={getIcon()} className="text-primary-light dark:text-primary-dark" /> */}
      <TimelineContent>
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 w-full overflow-x-auto">
          <TimelineTime className="text-xs text-secondary-light dark:text-secondary-dark mb-2 block whitespace-nowrap">
            {new Date(item.changedAt).toLocaleString()}
          </TimelineTime>

          <TimelineTitle className="text-sm sm:text-base font-semibold text-text-light dark:text-text-dark mb-3 break-words">
            {field === 'status' ? (
              <div className="flex flex-wrap items-center gap-2">
                Status changed from <StatusBadge status={item.previousStatus} /> to <StatusBadge status={item.newStatus} />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.field}</span> changed from{" "}
                <span className="font-mono bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-lg break-all text-sm">
                  {JSON.stringify(item.previousValue)}
                </span>{" "}
                to{" "}
                <span className="font-mono bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-lg break-all text-sm">
                  {JSON.stringify(item.newValue)}
                </span>
              </div>
            )}
          </TimelineTitle>

          {item.changedBy && (
            <TimelineBody className="text-xs sm:text-sm text-secondary-light dark:text-secondary-dark mb-2">
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <FaUser className="text-primary-light dark:text-primary-dark flex-shrink-0" />
                <span className="font-medium">Changed by:</span>
                <span className="break-words">
                  {item.changedBy.fname + " " + item.changedBy.lname || 'System'} ({item.changedBy.role || 'system'})
                </span>
              </span>
            </TimelineBody>
          )}

          {item.notes && (
            <TimelineBody className="text-xs sm:text-sm text-secondary-light dark:text-secondary-dark">
              <span className="inline-flex flex-wrap items-start gap-1.5">
                <FaInfoCircle className="text-primary-light dark:text-primary-dark flex-shrink-0 mt-1" />
                <span className="font-medium">Notes:</span>
                <span className="break-words">{item.notes}</span>
              </span>
            </TimelineBody>
          )}
        </div>
      </TimelineContent>
    </TimelineItem>
  );
};

export default HistoryItem;
