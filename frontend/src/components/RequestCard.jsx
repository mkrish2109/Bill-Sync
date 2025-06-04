import { FaUser, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import {StatusBadge} from './common/StatusBadge';

const RequestCard = ({ request, type, onAccept, onReject, userType }) => {
  const user = type === 'sent' ? request.receiver : request.sender;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="bg-surface-tertiaryLight dark:bg-surface-tertiaryDark rounded-full p-3 mr-3">
          <FaUser className="text-text-secondaryLight dark:text-text-secondaryDark" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">{user?.name}</h3>
          <p className="text-text-secondaryLight dark:text-text-secondaryDark">{user?.company || user?.experience}</p>
        </div>
      </div>
      
      {request.message && (
        <p className="text-text-light dark:text-text-dark mb-3 italic">"{request.message}"</p>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm">
          <StatusBadge status={request.status} size="sm" />
          <span className="mx-2 text-text-tertiaryLight dark:text-text-tertiaryDark">|</span>
          <FaClock className="text-text-tertiaryLight dark:text-text-tertiaryDark mr-1" />
          <span className="text-text-secondaryLight dark:text-text-secondaryDark">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
        </div>
        
        {type === 'received' && request.status === 'pending' && userType === 'worker' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onAccept(request._id)}
              className="bg-success-base hover:bg-success-hover text-success-text p-1 rounded-full transition-colors duration-200"
              title="Accept"
            >
              <FaCheck size={14} />
            </button>
            <button
              onClick={() => onReject(request._id)}
              className="bg-error-base hover:bg-error-hover text-error-text p-1 rounded-full transition-colors duration-200"
              title="Reject"
            >
              <FaTimes size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;