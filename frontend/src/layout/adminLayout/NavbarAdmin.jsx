import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/apiServices";
import { logoutUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import ThemeToggleButton from "../../components/comman/ThemeToggleButton";
import { Logo } from "../../components/comman/Logo";
import { useSidebar } from "../../context/SidebarContext";

const NavbarAdmin = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store?.user.user);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const handleToggle = useCallback(() => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  }, [toggleSidebar, toggleMobileSidebar]);

  const handleLogOut = useCallback(async () => {
    try {
      const response = await logout();
      dispatch(logoutUser());
      toast.success(response.message || "Logged out successfully",{
          pauseOnFocusLoss: false,
        });
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "An error occurred during logout");
    }
  }, [dispatch, navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  }, [navigate, searchTerm]);

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

  const userDropdownItems = useMemo(() => {
    if (!user) {
      return (
        <>
          <DropdownItem
            onClick={() => navigate("/login")}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Sign in
          </DropdownItem>
          <DropdownItem
            onClick={() => navigate("/register")}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Sign up
          </DropdownItem>
        </>
      );
    }

    return (
      <>
        {user.role === "admin" && (
          <DropdownItem
            onClick={() => navigate("/admin/dashboard")}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Admin Dashboard
          </DropdownItem>
        )}
        <DropdownItem
          onClick={() => navigate("/settings")}
          className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Settings
        </DropdownItem>
        <DropdownDivider className="border-gray-200 dark:border-gray-700" />
        <DropdownItem
          onClick={handleLogOut}
          className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Sign out
        </DropdownItem>
      </>
    );
  }, [user, navigate, handleLogOut]);

  const userDisplayName = useMemo(() => (
    user ? `${user.fname} ${user.lname}` : "Guest"
  ), [user]);

  const userEmail = useMemo(() => (
    user?.email || "Not logged in"
  ), [user]);

  return (
    <Navbar className=" sticky top-0 flex w-full z-10 bg-white border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          <NavbarBrand href="/" className="lg:hidden">
            <Logo variant="full" size="lg" />
          </NavbarBrand>

          <div className="hidden lg:block">
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
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-background-dark dark:text-text-dark/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-text-secondaryLight dark:border-gray-800 dark:bg-background-light/[0.03] dark:text-gray-400"
                  onClick={() => inputRef.current?.focus()}
                >
                  <span>⌘</span>
                  <span>K</span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex md:order-2 gap-2 items-center">
            <ThemeToggleButton />

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img={user?.profilePicture || "/images/profile.png"}
                  rounded
                  bordered
                  className="border-gray-300 dark:border-gray-600"
                />
              }
              className="z-50 w-60"
            >
              <DropdownHeader>
                <span className="block text-sm font-semibold text-gray-800 dark:text-text-dark">
                  {userDisplayName}
                </span>
                <span className="block truncate text-sm font-medium text-text-secondaryLight dark:text-gray-300">
                  {userEmail}
                </span>
              </DropdownHeader>
              <DropdownDivider className="border-gray-200 dark:border-gray-700" />
              {userDropdownItems}
            </Dropdown>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default NavbarAdmin;