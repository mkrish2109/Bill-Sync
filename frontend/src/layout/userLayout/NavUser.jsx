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
import { useNavigate,Link, useLocation } from "react-router-dom";
import ThemeToggleButton from "../../components/comman/ThemeToggleButton";
import { Logo } from "../../components/comman/Logo";

function NavbarAdmin() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store?.user.user);
  const location = useLocation(); // Properly get location from React Router
  const navigate = useNavigate();

  async function handleLogOut() {
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
  }

  return (
    <Navbar fluid className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
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
          <DropdownHeader className="bg-white dark:bg-gray-800">
            <span className="block text-sm font-semibold text-gray-800 dark:text-white">
              {user ? `${user.fname} ${user.lname}` : "Guest"}
            </span>
            <span className="block truncate text-sm font-medium text-gray-500 dark:text-gray-300">
              {user?.email || "Not logged in"}
            </span>
          </DropdownHeader>
          
          {user && (
            <>
              {user.role === "admin" && (
                <DropdownItem 
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Admin Dashboard
                </DropdownItem>
              )}
              {user.role === "worker" && (
                <DropdownItem 
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => navigate('/worker/dashboard')}
                >
                  Worker Dashboard
                </DropdownItem>
              )}
              {user.role === "buyer" && (
                <DropdownItem 
                  className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => navigate('/buyer/dashboard')}
                >
                  Buyer Dashboard
                </DropdownItem>
              )}
              <DropdownItem 
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate('/settings')}
              >
                Settings
              </DropdownItem>
              <DropdownDivider className="border-gray-200 dark:border-gray-700" />
              <DropdownItem 
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={handleLogOut}
              >
                Sign out
              </DropdownItem>
            </>
          )}
          
          {!user && (
            <>
              <DropdownItem 
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate('/login')}
              >
                Sign in
              </DropdownItem>
              <DropdownItem 
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate('/register')}
              >
                Sign up
              </DropdownItem>
            </>
          )}
        </Dropdown>
        
        <NavbarToggle className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" />
      </div>
      
      <NavbarCollapse className="bg-white dark:bg-gray-900 md:bg-transparent">
        <Link to="/">
          <NavbarLink 
            href="/" 
            active={location.pathname === '/'}
            className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
            activeClassName="text-[#44b8ff] dark:text-[#44b8ff] font-medium"
          >
            Home
          </NavbarLink>
        </Link>
        <Link to="/about">
          <NavbarLink 
            active={location.pathname === '/about'}
            className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
            activeClassName="text-[#44b8ff] dark:text-[#44b8ff] font-medium"
          >
            About
          </NavbarLink>
        </Link>
        <Link to="/services">
          <NavbarLink 
            href="/services" 
            active={location.pathname === '/services'}
            className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
            activeClassName="text-[#44b8ff] dark:text-[#44b8ff] font-medium"
          >
            Services
          </NavbarLink>
        </Link>
        <Link to="/pricing">
          <NavbarLink 
            active={location.pathname === '/pricing'}
            className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
            activeClassName="text-[#44b8ff] dark:text-[#44b8ff] font-medium"
          >
            Pricing
          </NavbarLink>
        </Link>
        <Link to="/contact">
          <NavbarLink 
            active={location.pathname === '/contact'}
            className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff] active:text-[#44b8ff] dark:active:text-[#44b8ff]"
            activeClassName="text-[#44b8ff] dark:text-[#44b8ff] font-medium"
            >
            Contact
          </NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}

export default NavbarAdmin;