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
import { useCallback, useMemo } from "react";
import { logout } from "../services/apiServices";
import { logoutUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import ThemeToggleButton from "../components/common/ThemeToggleButton";
import SideBarToggle from "../components/common/SideBarToggle"; // Optional
import { useSidebar } from "../context/SidebarContext"; // Optional
import { Logo } from "../components/common/Logo";

const NavLink = ({ to, children, exact = false }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavbarLink
      as={Link}
      to={to}
      active={isActive}
      className={`text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff] text-sm ${
        isActive ? "text-[#44b8ff] dark:text-[#44b8ff] font-medium" : ""
      }`}
    >
      {children}
    </NavbarLink>
  );
};

const NavBar = ({ showSidebarToggle = false }) => {
  const user = useSelector((store) => store?.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar?.() || {};

  const handleToggle = useCallback(() => {
    if (window.innerWidth >= 1024) {
      toggleSidebar?.();
    } else {
      toggleMobileSidebar?.();
    }
  }, [toggleSidebar, toggleMobileSidebar]);

  const handleLogOut = useCallback(async () => {
    try {
      const response = await logout();
      dispatch(logoutUser());
      if (response.status === 200) {
        toast.warning("Logged out successfully", { pauseOnFocusLoss: false });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  }, [dispatch]);

  const dropdownItems = useMemo(() => {
    if (!user) {
      return (
        <>
          <DropdownItem onClick={() => navigate("/login")}>Sign in</DropdownItem>
          <DropdownItem onClick={() => navigate("/register")}>Sign up</DropdownItem>
        </>
      );
    }

    return (
      <>
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
            <SideBarToggle handleToggle={handleToggle} isMobileOpen={isMobileOpen} />
          )}

          <NavbarBrand href="/" className={showSidebarToggle ? "lg:hidden" : ""}>
            <Logo variant="full" size="lg" />
          </NavbarBrand>

          <NavbarCollapse className="bg-background-light dark:bg-background-dark md:bg-transparent">
            <NavLink to="/" exact>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </NavbarCollapse>

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
              <DropdownHeader className="bg-background-light dark:bg-background-dark">
                <span className="block text-sm font-semibold text-gray-800 dark:text-text-dark">
                  {userName}
                </span>
                <span className="block truncate text-sm font-medium text-text-secondaryLight dark:text-gray-300">
                  {userEmail}
                </span>
              </DropdownHeader>

              {dropdownItems}
            </Dropdown>

            <NavbarToggle className="text-text-secondaryLight hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default NavBar;
