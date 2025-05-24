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
import ThemeToggleButton from "../../components/common/ThemeToggleButton";
import { Logo } from "../../components/common/Logo";
import { useSidebar } from "../../context/SidebarContext";
import SideBarToggle from "../../components/common/SideBarToggle";

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
    <Navbar className=" sticky top-0 flex w-full z-10 bg-white   dark:bg-gray-900 ">
      <div className="flex flex-col items-center justify-between grow">
        <div className="flex items-center justify-between w-full gap-2 px-3 sm:gap-4 lg:px-0 ">
          <SideBarToggle handleToggle={handleToggle} isMobileOpen={isMobileOpen}/>

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