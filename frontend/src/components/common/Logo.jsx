import { useContext } from "react";
import { useTheme } from "../../context/ThemeContext";

export const Logo = ({ variant = 'full', size = 'base', className = '' }) => {
  const { theme } = useTheme(); // Get current theme from context
  
  const sizeClasses = {
    sm: 'h-6',
    base: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {variant === 'icon' ? (
        <img 
          src="/logo/icon.svg" 
          alt="Tex Bill Icon" 
          className={`${sizeClasses[size]}`}
        />
      ) : (
        <img 
          src={theme === 'dark' ? "/logo/full-dark.svg" : "/logo/full-light.svg"} 
          alt="Tex Bill Logo" 
          className={`${sizeClasses[size]}`}
        />
      )}
    </div>
  );
};

// Monochrome version remains the same
export const MonoLogo = ({ color = 'currentColor', size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M8 8H28V28H8V8ZM10 10V26H26V10H10ZM12 14H24V16H12V14ZM12 20H24V22H12V20Z" 
      fill={color}
    />
    <path 
      d="M16 14H20V22H16V14Z" 
      fill={color === 'currentColor' ? 'white' : 'var(--background)'}
    />
  </svg>
);