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
  TextInput,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/apiServices";
import { logoutUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ThemeToggleButton from "../../components/comman/ThemeToggleButton";

function NavbarAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store?.user.user);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleLogOut() {
    try {
      const response = await logout();
      dispatch(logoutUser());
      if (response.status === 200) {
        toast.warning("Logged out successfully");
        navigate("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <Navbar 
      fluid 
      className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700"
    >
      

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center w-1/3 mx-auto">
        <TextInput
          type="text"
          placeholder="Search..."
          className="w-full rounded-md  text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-[#44b8ff] focus:ring-[#44b8ff] border-gray-300 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

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
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Admin Dashboard
                </DropdownItem>
              )}
              <DropdownItem 
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate("/settings")}
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
                onClick={() => navigate("/login")}
              >
                Sign in
              </DropdownItem>
              <DropdownItem 
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate("/register")}
              >
                Sign up
              </DropdownItem>
            </>
          )}
        </Dropdown>

        <NavbarToggle className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" />
      </div>

      {/* <NavbarCollapse className="bg-white dark:bg-gray-900 md:bg-transparent">
        <NavbarLink 
          as={Link} 
          to="/" 
          className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
          activeClassName="text-[#44b8ff] dark:text-[#44b8ff]"
        >
          Home
        </NavbarLink>
        <NavbarLink 
          as={Link} 
          to="/about" 
          className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
          activeClassName="text-[#44b8ff] dark:text-[#44b8ff]"
        >
          About
        </NavbarLink>
        <NavbarLink 
          as={Link} 
          to="/services" 
          className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
          activeClassName="text-[#44b8ff] dark:text-[#44b8ff]"
        >
          Services
        </NavbarLink>
        <NavbarLink 
          as={Link} 
          to="/contact" 
          className="text-gray-700 hover:text-[#44b8ff] dark:text-gray-300 dark:hover:text-[#44b8ff]"
          activeClassName="text-[#44b8ff] dark:text-[#44b8ff]"
        >
          Contact
        </NavbarLink>
      </NavbarCollapse> */}
    </Navbar>
  );
}

export default NavbarAdmin;