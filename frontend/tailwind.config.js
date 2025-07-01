const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", ".flowbite-react/class-list.json"],
  theme: {
    extend: {
      colors: {
        // === Backgrounds ===
        background: {
          light: "#FFFFFF",
          dark: "#161616",
          surfaceLight: "#F9FAFB",
          surfaceDark: "#1E1E20", // More contrast-safe for dark surfaces
          elevatedLight: "#FFFFFF",
          elevatedDark: "#21262D", // Better against text-primary-dark
        },

        // === Text Colors ===
        text: {
          light: "#1A1A1A", // deeper black for white backgrounds
          dark: "#F5F5F5", // brighter white for dark backgrounds
          secondaryLight: "#374151",
          secondaryDark: "#D1D5DB",
          mutedLight: "#6B7280",
          mutedDark: "#9CA3AF",
        },

        // === Primary Brand Color ===
        primary: {
          light: "#7A4F2A", // deeper bronze for better contrast with white
          dark: "#D4B483", // brighter gold-tan for dark backgrounds
          hoverLight: "#5C3C20", // hover contrast for light mode
          hoverDark: "#FFD794", // hover contrast for dark mode
          disabledLight: "#C6A782",
          disabledDark: "#998866",
        },

        // === Accent (contrast-safe adjusted) ===
        accent: {
          light: "#5A3E28", // deeper bronze for light bg
          dark: "#F4E1B5", // softer and brighter than original for contrast
          muted: "#8A6D56", // fallback muted tone
        },

        // === Secondary Styling ===
        secondary: {
          light: "#55617A", // updated from #7F8CAA — dark enough for white
          hoverLight: "#445066",
          dark: "#B8CFCE",
          hoverDark: "#9DB9B8",
        },

        // === UI Feedback ===
        success: {
          base: "#059669",
          hover: "#047857",
          active: "#065F46",
          disabled: "#A7F3D0",
          text: "#F0FDF4",
        },
        warning: {
          base: "#D97706",
          hover: "#B45309",
          active: "#92400E",
          disabled: "#FDE68A",
          text: "#FFFBEB",
        },
        error: {
          base: "#DC2626",
          hover: "#B91C1C",
          active: "#991B1B",
          disabled: "#FCA5A5",
          text: "#FEF2F2",
        },
        info: {
          base: "#2563EB",
          hover: "#1D4ED8",
          active: "#1E40AF",
          disabled: "#BFDBFE",
          text: "#EFF6FF",
        },

        // === Borders ===
        border: {
          light: "#E5E7EB",
          dark: "#2D2D34",
          hoverLight: "#D1D5DB",
          hoverDark: "#3D3D44",
          activeLight: "#9CA3AF",
          activeDark: "#4D4D54",
          subtleLight: "#F3F4F6",
          subtleDark: "#3D3D44",
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
