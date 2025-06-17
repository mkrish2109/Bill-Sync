import { memo } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const sizeClasses = {
  sm: "h-6",
  base: "h-8",
  lg: "h-10",
  xl: "h-12",
};

export const Logo = memo(
  ({ variant = "full", size = "base", className = "" }) => {
    const { theme } = useTheme();

    return (
      <div className={`inline-flex items-center ${className}`}>
        {variant === "icon" ? (
          <img
            src={
              theme === "dark" ? "/logo/icon-dark.svg" : "/logo/icon-light.svg"
            }
            alt="Bill Sync Icon"
            className={sizeClasses[size]}
            loading="eager"
            fetchpriority="high"
            width={
              size === "sm"
                ? 24
                : size === "base"
                ? 32
                : size === "lg"
                ? 40
                : 48
            }
            height={
              size === "sm"
                ? 24
                : size === "base"
                ? 32
                : size === "lg"
                ? 40
                : 48
            }
          />
        ) : (
          <img
            src={
              theme === "dark" ? "/logo/full-dark.svg" : "/logo/full-light.svg"
            }
            alt="Bill Sync Logo"
            className={sizeClasses[size]}
            loading="eager"
            fetchpriority="high"
            width={
              size === "sm"
                ? 96
                : size === "base"
                ? 128
                : size === "lg"
                ? 160
                : 192
            }
            height={
              size === "sm"
                ? 24
                : size === "base"
                ? 32
                : size === "lg"
                ? 40
                : 48
            }
          />
        )}
      </div>
    );
  }
);

Logo.displayName = "Logo";
