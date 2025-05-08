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
import { Link } from "react-router-dom";


 function NavUser() {
  const dispatch = useDispatch();


  const user = useSelector((store) => {

    return store?.user.user;
  });

  async function handleLogOut() {
    const response = await logout();
    dispatch(logoutUser());
    if (response.status === 200) {
      toast.warning("Logout Successfully");
    } else {
      toast.error(response.message);
    }
  }
  return (
    <Navbar fluid  >
      <NavbarBrand href="/">
        <img src="/images/logo.png" className="mr-3 h-6 sm:h-9" alt="Tex Bill Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-[#44b8ff]">Tex Bill</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown 
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="/images/profile.png" rounded />
          }
        >
          <DropdownHeader>
              <span className="block text-sm">
                    {user ? user.fname : "John"}
              </span>
              <span className="block truncate text-sm font-medium">
                {user ? user.email : "johnduo123@gmail.com"}
              </span>
          </DropdownHeader>
          {
            user?.role === "admin" ? (
              <Link to="/admin/dashboard">
                <DropdownItem>Dashboard</DropdownItem>
              </Link>
            ) : user?.role === "worker" ? (
              <Link to="/worker/dashboard">
                <DropdownItem>Dashboard</DropdownItem>
              </Link>
            ) : user?.role === "buyer" ? (
              <Link to="/buyer/dashboard">
                <DropdownItem>Dashboard</DropdownItem>
              </Link>
            ) : null
          }
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          {user ? (
              <DropdownItem onClick={handleLogOut}>Sign out</DropdownItem>
            ) : null}
            {!user ? (
              <Link to="/login">
                <DropdownItem>Sign In</DropdownItem>
              </Link>
            ) : null}
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default NavUser;