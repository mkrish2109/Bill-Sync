const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", ".flowbite-react/class-list.json"],
  theme: {
    extend: {
      colors: {
        // Backgrounds - Adjusted for better contrast
        background: {
          light: "#FFFFFF",
          dark: "#1A1A1E",
          secondaryLight: "#F9FAFB",
          secondaryDark: "#24242A",
          tertiaryLight: "#F3F4F6",
          tertiaryDark: "#2E2E34",
        },

        // Text - Improved contrast for dark mode
        text: {
          light: "#111827",
          dark: "#FFFFFF", // Brighter for better readability
          secondaryLight: "#6B7280",
          secondaryDark: "#E5E7EB", // Brighter secondary text
          tertiaryLight: "#4B5563",
          tertiaryDark: "#D1D5DB", // Brighter tertiary text
        },

        // Surfaces - Adjusted for better depth
        surface: {
          light: "#F9FAFB",
          dark: "#23232A",
          elevatedLight: "#FFFFFF",
          elevatedDark: "#2D2D34",
        },

        // Primary - Improved contrast
        primary: {
          light: "#2C3639", // Matches dark mode background
          dark: "#E0E6F2", // Matches "Sync" text and icon fill
          hoverLight: "#1C2629",
          hoverDark: "#D1D5DB", // Slightly darker for hover
          activeLight: "#0C1619",
          activeDark: "#C2C6CC", // Matches lighter text variant
          disabledLight: "#8C9699",
          disabledDark: "#6B7280", // Neutral disabled tone
        },

        secondary: {
          light: "#916e52", // Matches brand tone
          dark: "#D4B483", // Matches "Bill" text and accent
          hoverLight: "#926B4C",
          hoverDark: "#C4A473", // Slightly darker hover
          activeLight: "#825B3C",
          activeDark: "#B49463", // Darker accent for active
          disabledLight: "#D2BBA2",
          disabledDark: "#9CA3AF", // Neutral disabled
        },

        // Accent colors - Improved visibility
        accent: {
          light: "#A27B5C",
          dark: "#F3F4F6", // Brighter for better visibility
          muted: "#8A6D56",
        },

        // State colors - Better visibility in dark mode
        success: {
          base: "#10B981",
          hover: "#0E9C6F",
          active: "#0C7A59", // Added
          disabled: "#A7F3D0", // Added
          text: "#ECFDF5", // Added for text on success
        },
        warning: {
          base: "#F59E0B",
          hover: "#DB8E09",
          active: "#B77908", // Added
          disabled: "#FDE68A", // Added
          text: "#78350F", // Added for text on warning
        },
        error: {
          base: "#EF4444",
          hover: "#DC2626",
          active: "#B91C1C", // Added
          disabled: "#FCA5A5", // Added
          text: "#FEE2E2", // Added for text on error
        },
        info: {
          base: "#3B82F6", // Added new info color
          hover: "#2563EB",
          active: "#1D4FD8",
          disabled: "#BFDBFE",
          text: "#EFF6FF",
        },
        border: {
          light: "#E5E7EB",
          dark: "#374151",
          hoverLight: "#D1D5DB",
          hoverDark: "#4B5563",
          activeLight: "#9CA3AF", // Added
          activeDark: "#6B7280", // Added
          subtleLight: "#F3F4F6", // Added for very subtle borders
          subtleDark: "#4B5563", // Added
        },
      },

      // Rest of your config remains the same...
      transitionProperty: {
        colors: "background-color, border-color, color, fill, stroke",
        opacity: "opacity",
        transform: "transform",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-dark":
          "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        focus: "0 0 0 3px rgba(59, 130, 246, 0.5)",
        "focus-dark": "0 0 0 3px rgba(74, 144, 255, 0.5)",
      },
      opacity: {
        disabled: "0.5",
        hover: "0.8",
        active: "0.9",
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },
    },
  },
  plugins: [flowbiteReact],
};
