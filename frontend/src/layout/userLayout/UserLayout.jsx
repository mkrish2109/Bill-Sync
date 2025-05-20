import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserFooter from "./UserFooter";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import NavBar from "../NavBar";

function UserLayout() {
  const { pathname } = useLocation();

  const isLoginRegister = pathname === "/login" || pathname === "/register";

  return (
    <>
      <NavBar />
      <ToastContainer closeOnClick />
      <Outlet />
      {!isLoginRegister && <UserFooter />}
    </>
  );
}

export default UserLayout;
