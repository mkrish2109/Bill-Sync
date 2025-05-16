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
import { logout } from "../../services/apiServices";
import { logoutUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ThemeToggleButton from "../../components/comman/ThemeToggleButton";
import { Logo } from "../../components/comman/Logo";

// Custom NavLink component to properly handle active state
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
      className={`text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff] ${
        isActive ? 'text-[#44b8ff] dark:text-[#44b8ff] font-medium' : ''
      }`}
    >
      {children}
    </NavbarLink>
  );
};

function NavUser() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store?.user.user);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await logout();
      dispatch(logoutUser());
      if (response.status === 200) {
        toast.warning("Logged out successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  };

  const renderUserDropdown = () => {
    if (!user) {
      return (
        <>
          <DropdownItem 
            onClick={() => navigate('/login')}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Sign in
          </DropdownItem>
          <DropdownItem 
            onClick={() => navigate('/register')}
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
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Admin Dashboard
          </DropdownItem>
        )}
        {user.role === "worker" && (
          <DropdownItem 
            onClick={() => navigate('/worker/dashboard')}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Worker Dashboard
          </DropdownItem>
        )}
        {user.role === "buyer" && (
          <DropdownItem 
            onClick={() => navigate('/buyer/dashboard')}
            className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Buyer Dashboard
          </DropdownItem>
        )}
        <DropdownItem 
          onClick={() => navigate('/settings')}
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
  };

  return (
    <Navbar 
      fluid 
      className="bg-background-light dark:bg-background-dark shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700"
    >
      <NavbarBrand href="/">
        <Logo variant="full" size="lg" />
      </NavbarBrand>
      
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
          className="z-50"
        >
          <DropdownHeader className="bg-background-light dark:bg-background-dark">
            <span className="block text-sm font-semibold text-gray-800 dark:text-text-dark">
              {user ? `${user.fname} ${user.lname}` : "Guest"}
            </span>
            <span className="block truncate text-sm font-medium text-text-secondaryLight dark:text-gray-300">
              {user?.email || "Not logged in"}
            </span>
          </DropdownHeader>
          
          {renderUserDropdown()}
        </Dropdown>
        
        <NavbarToggle className="text-text-secondaryLight hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" />
      </div>
      
      <NavbarCollapse className="bg-background-light dark:bg-background-dark md:bg-transparent">
        <NavLink to="/" exact>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default NavUser;