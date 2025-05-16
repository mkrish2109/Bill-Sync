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
        },

        // Text
        text: {
          light: '#111827',
          dark: '#F9FAFB',
          secondaryLight: '#6B7280',
          secondaryDark: '#9CA3AF',
        },

        // Surfaces
        surface: {
          light: '#F9FAFB',
          dark: '#1F2937',
        },

        // Primary Colors (+ Hover)
        primary: {
          light: '#44B8FF',
          dark: '#0E90E0',
          hoverLight: '#2EAAFF',  // 10% darker than primary.light
          hoverDark: '#0B7BC7',   // 10% darker than primary.dark
        },

        // Secondary Colors (+ Hover)
        secondary: {
          light: '#6B7280',
          dark: '#9CA3AF',
          hoverLight: '#5C6270',  // 10% darker than secondary.light
          hoverDark: '#8A919E',   // 10% darker than secondary.dark
        },

        // Borders (+ Hover)
        border: {
          light: '#E5E7EB',
          dark: '#374151',
          hoverLight: '#D1D5DB',  // Slightly darker for interaction
          hoverDark: '#4B5563',   // Slightly lighter for contrast
        },

        // Accent Colors (+ Hover)
        accent: {
          light: '#2563EB',
          dark: '#3B82F6',
          hoverLight: '#1D4FD8',  // 10% darker than accent.light
          hoverDark: '#2563EB',   // 10% darker than accent.dark
        },

        // State Colors (Success, Warning, Error + Hover)
        success: {
          base: '#10B981',
          hover: '#0E9C6F',       // 10% darker
        },
        warning: {
          base: '#F59E0B',
          hover: '#DB8E09',       // 10% darker
        },
        error: {
          base: '#EF4444',
          hover: '#DC2626',       // 10% darker
        },
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        '200': '200ms',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
      },
    },
  },
  plugins: [flowbiteReact],
}