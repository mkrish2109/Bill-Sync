import { Link } from "react-router-dom";
import { FaHome, FaHeadset } from "react-icons/fa";
import { PageMeta } from "../components/common/PageMeta";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <PageMeta title="404 - Page Not Found | Bill Sync" />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="relative">
              {/* 404 text with enhanced gradient and animation */}
              <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-accent-light to-primary-light dark:from-primary-dark dark:via-accent-dark dark:to-primary-dark animate-gradient-x">
                404
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light via-accent-light to-primary-light dark:from-primary-dark dark:via-accent-dark dark:to-primary-dark opacity-20 blur-3xl rounded-full -z-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">
              Oops! Page not found
            </h2>

            <p className="text-lg text-text-secondaryLight dark:text-text-secondaryDark">
              The page you're looking for might have been moved or doesn't
              exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group relative flex items-center justify-center py-3 px-6 dark:border dark:border-transparent text-sm font-medium rounded-lg text-text-dark dark:text-text-light bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaHome className="mr-2 h-5 w-5" />
              Go back home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group relative flex items-center justify-center py-3 px-6 border border-border-light dark:border-border-dark text-sm font-medium rounded-lg text-text-light dark:text-text-dark bg-background-surfaceLight dark:bg-background-surfaceDark  focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg
                className="mr-2 h-5 w-5 text-text-secondaryLight dark:text-text-secondaryDark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Go back
            </button>
          </div>
        </div>
      </main>

      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
            Need help?{" "}
            <Link
              to="/contact"
              className="inline-flex items-center font-medium text-primary-light hover:text-primary-hoverLight dark:text-primary-dark dark:hover:text-primary-hoverDark transition-colors duration-200"
            >
              <FaHeadset className="mr-1 h-4 w-4" />
              Contact support
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
