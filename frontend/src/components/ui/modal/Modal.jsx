import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

function Modal({ isOpen, onClose, children, className = "" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-overlay-dark backdrop-blur-sm overflow-y-auto py-4 mt-0"
      onClick={onClose}
    >
      <div
        className={`relative bg-background-surfaceLight dark:bg-background-dark mx-4 md:mx-0 rounded-lg shadow-xl max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto smooth-scroll ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-background-surfaceLight dark:hover:bg-background-elevatedDark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
          aria-label="Close modal"
          type="button"
        >
          <IoCloseSharp size={22} className="text-text-light dark:text-text-dark"/>
        </button>
        <div className="p-6 text-text-light dark:text-text-dark">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
