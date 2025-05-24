export const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`py-3 sm:py-4 px-4 sm:px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center transition-all duration-200 relative whitespace-nowrap ${
      active 
        ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark bg-primary-light/5 dark:bg-primary-dark/5' 
        : 'border-transparent text-secondary-light dark:text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark hover:bg-surface-light/50 dark:hover:bg-surface-dark/50'
    }`}
  >
    <Icon className={`mr-2 flex-shrink-0 ${active ? 'text-primary-light dark:text-primary-dark' : 'text-secondary-light dark:text-secondary-dark'}`} />
    <span className="truncate">{children}</span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light dark:bg-primary-dark transform scale-x-100 transition-transform duration-200" />
    )}
  </button>
);