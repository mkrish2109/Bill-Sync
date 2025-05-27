export const StatusBadge = ({ status, size = 'md', className = '' }) => {
const statusColors = {
  pending: 'bg-warning-base/20 border-warning-base text-warning-base dark:bg-warning-hover/20 dark:text-warning-hover dark:border-warning-base',
  accepted: 'bg-success-base/20 border-success-base text-success-base dark:bg-success-hover/20 dark:text-success-hover dark:border-success-base',
  rejected: 'bg-error-base/20 border-error-base text-error-base dark:bg-error-hover/20 dark:text-error-hover dark:border-error-base',
  assigned: 'bg-primary-light/20 border-primary-light text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark dark:border-primary-dark',
  'in-progress': 'bg-warning-base/20 border-warning-base text-warning-base dark:bg-warning-hover/20 dark:text-warning-hover dark:border-warning-base',
  completed: 'bg-success-base/20 border-success-base text-success-base dark:bg-success-hover/20 dark:text-success-hover dark:border-success-base',
  cancelled: 'bg-error-base/20 border-error-base text-error-base dark:bg-error-hover/20 dark:text-error-hover dark:border-error-base',
  default: 'bg-secondary-light/20 border-secondary-light text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark dark:border-secondary-dark'
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

return (
  <span 
    className={`
      inline-flex items-center capitalize rounded-full font-medium border
      ${statusColors[status] || statusColors.default}
      ${sizeClasses[size]}
      ${className}
    `}
  >
    {status}
  </span>
);
};
