// components/common/TabButton.jsx
const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
      active 
        ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark' 
        : 'border-transparent text-secondary-light dark:text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark'
    }`}
  >
    <Icon className="mr-2" />
    {children}
  </button>
);

export default TabButton;