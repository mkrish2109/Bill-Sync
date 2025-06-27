import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { logoutUser } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import ThemeToggleButton from "../components/common/ThemeToggleButton";
import SideBarToggle from "../components/common/SideBarToggle";
import { useSidebar } from "../contexts/SidebarContext";
import { Logo } from "../components/common/Logo";
import NotificationBell from "../components/NotificationBell";
import TokenRefreshIndicator from "../components/common/TokenRefreshIndicator";
import { FaSearch } from "react-icons/fa";

const NavLink = ({ to, children, exact = false, className = "" }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavbarLink
      as={Link}
      to={to}
      active={isActive}
      className={`transition-colors duration-200 text-text-light  hover:text-primary-light md:hover:text-primary-light
         dark:text-text-dark dark:hover:text-primary-dark dark:md:hover:text-primary-dark text-sm py-2 px-3 w-full text-center md:w-auto rounded-md ${
           isActive
             ? "bg-primary-light/5 text-primary-light md:text-primary-light  dark:bg-blue-900/20 dark:text-primary-dark font-medium"
             : ""
         } ${className}`}
    >
      {children}
    </NavbarLink>
  );
};

const AppNavbar = ({ variant = "default", showSidebarToggle = false }) => {
  const user = useSelector((store) => store?.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } =
    useSidebar?.() || {};

  const navigationItems = [
    { name: "Home", path: "/", exact: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleToggle = useCallback(() => {
    if (window.innerWidth >= 1024) {
      toggleSidebar?.();
    } else {
      toggleMobileSidebar?.();
    }
  }, [toggleSidebar, toggleMobileSidebar]);

  const handleLogOut = useCallback(async () => {
    try {
      const response = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(response)) {
        toast.success(logoutUser.payload?.message || "Logout successful");
        navigate("/login");
      }
      if (logoutUser.rejected.match(response)) {
        toast.error(response.payload?.message || "Logout failed!");
        return;
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  }, [dispatch, navigate]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        setSearchTerm("");
      }
    },
    [navigate, searchTerm]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const dropdownItems = useMemo(() => {
    if (!user) {
      return (
        <>
          <DropdownItem onClick={() => navigate("/login")}>
            Sign in
          </DropdownItem>
          <DropdownItem onClick={() => navigate("/register")}>
            Sign up
          </DropdownItem>
        </>
      );
    }

    return (
      <>
        {user.role === "admin" && (
          <DropdownItem onClick={() => navigate("/admin/dashboard")}>
            Admin Dashboard
          </DropdownItem>
        )}
        {user.role === "buyer" && (
          <DropdownItem onClick={() => navigate("/buyer/dashboard")}>
            Buyer Dashboard
          </DropdownItem>
        )}
        {user.role === "worker" && (
          <DropdownItem onClick={() => navigate("/worker/dashboard")}>
            Worker Dashboard
          </DropdownItem>
        )}
        <DropdownItem onClick={() => navigate("/settings")}>
          Settings
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={handleLogOut}>Sign out</DropdownItem>
      </>
    );
  }, [user, navigate, handleLogOut]);

  const userName = user ? `${user.fname} ${user.lname}` : "Guest";
  const userEmail = user?.email || "Not logged in";

  return (
    <Navbar className="sticky top-0 flex w-full z-10 bg-background-light dark:bg-background-dark shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center justify-between grow">
        <div className="flex items-center justify-between w-full gap-2 px-3 sm:gap-4 lg:px-0">
          {showSidebarToggle && (
            <SideBarToggle
              handleToggle={handleToggle}
              isMobileOpen={isMobileOpen}
            />
          )}

          <NavbarBrand
            href="/"
            className={showSidebarToggle ? "lg:hidden" : ""}
          >
            <Logo variant="full" size="lg" />
          </NavbarBrand>

          {variant === "default" && (
            <NavbarCollapse className="bg-background-light dark:bg-background-dark sm:bg-transparent w-full md:w-auto absolute md:relative top-full left-0 right-0">
              {navigationItems.map((item) => (
                <NavLink key={item.path} to={item.path} exact={item.exact}>
                  {item.name}
                </NavLink>
              ))}
            </NavbarCollapse>
          )}

          {variant === "admin" && (
            <div className="hidden md:block">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                    {/* search logo */}
                    <FaSearch className="text-secondary-light dark:text-secondary-dark" />
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search or type command..."
                    className="h-11 w-full rounded-lg border border-border-light bg-transparent py-2.5 pl-12 pr-14 text-sm text-text-secondaryLight dark:text-text-secondaryDark shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-border-light dark:bg-background-dark dark:placeholder:text-white/30 dark:focus:border-border-dark md:w-[300px] lg:w-[430px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-background-surfaceLight px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-text-secondaryLight dark:border-background-surfaceDark dark:bg-background-surfaceDark dark:text-text-dark"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <span className="text-secondary-light dark:text-secondary-dark">
                      ⌘
                    </span>
                    <span className="text-secondary-light dark:text-secondary-dark">
                      K
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex md:order-2 gap-2 items-center">
            <ThemeToggleButton />

            {user && <TokenRefreshIndicator />}
            {user && <NotificationBell />}

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img={user?.profilePicture || "/images/profile.webp"}
                  rounded
                  bordered
                  className="border-gray-300 dark:border-gray-600"
                />
              }
              className="z-50 w-60"
            >
              <DropdownHeader className="bg-background-light dark:bg-gray-900">
                <span className="block text-sm font-semibold text-text-light dark:text-text-dark">
                  {userName}
                </span>
                <span className="block truncate text-sm font-medium text-text-secondaryLight dark:text-gray-300">
                  {userEmail}
                </span>
              </DropdownHeader>
              {dropdownItems}
            </Dropdown>

            {variant === "default" && (
              <NavbarToggle className="text-text-secondaryLight hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" />
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {variant === "admin" && (
          <div className="w-full px-3 py-2 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-text-light shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-background-dark dark:text-text-dark/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default AppNavbar;
