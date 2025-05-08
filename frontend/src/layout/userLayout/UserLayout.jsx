import React from "react";
import NavUser from "./NavUser";
import { Outlet, useLocation } from "react-router-dom";
import UserFooter from "./UserFooter";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

function UserLayout() {
  const { pathname } = useLocation();

  const isLoginRegister = pathname === "/login" || pathname === "/register";

  return (
    <>
      <NavUser />
      <ToastContainer closeOnClick />
      <Outlet />
      {!isLoginRegister && <UserFooter />}
    </>
  );
}

export default UserLayout;
