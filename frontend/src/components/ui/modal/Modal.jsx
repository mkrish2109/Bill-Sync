import { useEffect } from 'react';

function Modal({ isOpen, onClose, children, className = '' })  {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-modal flex items-center justify-center bg-overlay-dark backdrop-blur-sm overflow-y-auto py-4"
      onClick={onClose}
    >
      <div 
        className={`relative bg-surface-light dark:bg-surface-dark mx-4 md:mx-0 rounded-lg shadow-xl max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto smooth-scroll ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-tertiaryLight dark:hover:bg-surface-elevatedDark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
          aria-label="Close modal"
        >
          <svg 
            className="w-5 h-5 text-text-secondaryLight dark:text-text-secondaryDark" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        <div className="p-6 text-text-light dark:text-text-dark">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;