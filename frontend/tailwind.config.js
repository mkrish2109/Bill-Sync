const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", ".flowbite-react/class-list.json"],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: {
          light: '#FFFFFF',
          dark: '#111827',
          secondaryLight: '#F9FAFB',
          secondaryDark: '#1F2937',
          tertiaryLight: '#F3F4F6', // Added for subtle differentiation
          tertiaryDark: '#1F2937',   // Same as secondaryDark for consistency
        },

        // Text
        text: {
          light: '#111827',
          dark: '#F9FAFB',
          secondaryLight: '#6B7280',
          secondaryDark: '#9CA3AF',
          tertiaryLight: '#4B5563', // Added for less important text
          tertiaryDark: '#6B7280',  // Added for less important dark text
          invertedLight: '#FFFFFF', // For text on colored backgrounds
          invertedDark: '#111827',  // For text on colored dark backgrounds
        },

        // Surfaces
        surface: {
          light: '#F9FAFB',
          dark: '#1F2937',
          elevatedLight: '#FFFFFF', // For elevated components
          elevatedDark: '#374151',  // For elevated dark components
        },

        // Primary Colors (+ Hover, Active, Disabled)
        primary: {
          light: '#44B8FF',
          dark: '#0E90E0',
          hoverLight: '#2EAAFF',
          hoverDark: '#0B7BC7',
          activeLight: '#1A9CFF',   // Added
          activeDark: '#0966B3',    // Added
          disabledLight: '#B3E0FF', // Added
          disabledDark: '#0E4D80',  // Added
        },

        // Secondary Colors (+ Hover, Active, Disabled)
        secondary: {
          light: '#6B7280',
          dark: '#9CA3AF',
          hoverLight: '#5C6270',
          hoverDark: '#8A919E',
          activeLight: '#4E5565',   // Added
          activeDark: '#7B8494',    // Added
          disabledLight: '#D1D5DB', // Added
          disabledDark: '#6B7280',  // Added
        },

        // Accent Colors (+ Hover, Active, Disabled)
        accent: {
          light: '#2563EB',
          dark: '#3B82F6',
          hoverLight: '#1D4FD8',
          hoverDark: '#2563EB',
          activeLight: '#1A47C7',   // Added
          activeDark: '#1D4FD8',    // Added
          disabledLight: '#93C5FD',  // Added
          disabledDark: '#1E40AF',  // Added
        },

        // State Colors (Success, Warning, Error, Info + Hover, Active, Disabled)
        success: {
          base: '#10B981',
          hover: '#0E9C6F',
          active: '#0C7A59',        // Added
          disabled: '#A7F3D0',      // Added
          text: '#ECFDF5',          // Added for text on success
        },
        warning: {
          base: '#F59E0B',
          hover: '#DB8E09',
          active: '#B77908',        // Added
          disabled: '#FDE68A',      // Added
          text: '#78350F',          // Added for text on warning
        },
        error: {
          base: '#EF4444',
          hover: '#DC2626',
          active: '#B91C1C',        // Added
          disabled: '#FCA5A5',      // Added
          text: '#FEE2E2',          // Added for text on error
        },
        info: {
          base: '#3B82F6',          // Added new info color
          hover: '#2563EB',
          active: '#1D4FD8',
          disabled: '#BFDBFE',
          text: '#EFF6FF',
        },

        // Borders (+ Hover, Active)
        border: {
          light: '#E5E7EB',
          dark: '#374151',
          hoverLight: '#D1D5DB',
          hoverDark: '#4B5563',
          activeLight: '#9CA3AF',    // Added
          activeDark: '#6B7280',     // Added
          subtleLight: '#F3F4F6',    // Added for very subtle borders
          subtleDark: '#4B5563',     // Added
        },

        // Additional functional colors
        highlight: {
          light: '#EFF6FF',         // Added for highlighted sections
          dark: '#1E3A8A',          // Added
        },
        overlay: {
          light: 'rgba(0, 0, 0, 0.1)',  // Added for overlays
          dark: 'rgba(0, 0, 0, 0.5)',
        },

        // Data visualization colors
        data: {
          blue: '#3B82F6',          // Added for charts
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B',
          purple: '#8B5CF6',
          pink: '#EC4899',
          orange: '#F97316',
          cyan: '#06B6D4',
        }
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
        'opacity': 'opacity',       // Added
        'transform': 'transform',   // Added
      },
      transitionDuration: {
        '150': '150ms',             // Added
        '200': '200ms',
        '300': '300ms',             // Added
        '500': '500ms',             // Added
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)', // Added
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.5)', // Added for focus states
        'focus-dark': '0 0 0 3px rgba(37, 99, 235, 0.5)',
      },
      opacity: {
        'disabled': '0.5',          // Added for disabled states
        'hover': '0.8',             // Added for hover states
        'active': '0.9',            // Added for active states
      },
      zIndex: {
        'dropdown': '1000',         // Added for common z-index values
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [flowbiteReact],
};