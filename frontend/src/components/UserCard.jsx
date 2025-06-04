import { useState } from 'react';
import { FaUser, FaPhone, FaBriefcase, FaTools } from 'react-icons/fa';

const UserCard = ({ user, userType, onSendRequest }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      console.log(message)
      console.log(user._id)
      await onSendRequest(user._id, message);
      setShowForm(false);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card dark:shadow-card-dark p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center mb-4">
        <div className="bg-surface-tertiaryLight dark:bg-surface-tertiaryDark rounded-full p-3 mr-4">
          <FaUser className="text-text-secondaryLight dark:text-text-secondaryDark text-xl" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">{user.name}</h3>
          <div className="flex items-center text-text-secondaryLight dark:text-text-secondaryDark text-sm">
            <FaPhone className="mr-1" />
            <span>{user.contact}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-text-secondaryLight dark:text-text-secondaryDark">
          <FaBriefcase className="mr-2" />
          <span className="text-sm">{user.experience || 'No experience listed'}</span>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div>
            <div className="flex items-center text-text-secondaryLight dark:text-text-secondaryDark mb-2">
              <FaTools className="mr-2" />
              <span className="text-sm font-medium">Skills:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-primary-light dark:bg-primary-dark hover:bg-primary-hoverLight dark:hover:bg-primary-hoverDark text-text-invertedLight dark:text-text-invertedDark py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Send Request
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            className="w-full p-3 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-sm bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark"
            rows="3"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark transition-colors duration-200 text-text-light dark:text-text-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-text-invertedLight dark:text-text-invertedDark rounded-lg hover:bg-primary-hoverLight dark:hover:bg-primary-hoverDark transition-colors duration-200 disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserCard;