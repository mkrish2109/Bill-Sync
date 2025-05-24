import { Badge } from 'flowbite-react';

export const StatusBadge = ({ status }) => {
  const badgeColors = {
    'assigned': 'bg-primary-light/20 border-primary-light text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark dark:border-primary-dark',
    'in-progress': 'bg-warning-base/20 border-warning-base text-warning-base dark:bg-warning-hover/20 dark:text-warning-hover dark:border-warning-base',
    'completed': 'bg-success-base/20 border-success-base text-success-base dark:bg-success-hover/20 dark:text-success-hover dark:border-success-base',
    'cancelled': 'bg-error-base/20 border-error-base text-error-base dark:bg-error-hover/20 dark:text-error-hover dark:border-error-base',
    'default': 'secondary'
  };

  return (
    <Badge 
      color={badgeColors[status] || badgeColors.default} 
      className={
        `inline-flex items-center capitalize px-3 py-1 rounded-full text-sm font-medium
        ${badgeColors[status]} || ${badgeColors.default}`
      }
    >
      {status}
    </Badge>
  );
};