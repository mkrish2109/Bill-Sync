import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserFooter from "./UserFooter";
import "react-toastify/dist/ReactToastify.css";
import {  ToastContainer } from "react-toastify";
import { SidebarProvider } from "../../context/SidebarContext";
import AppNavbar from "../AppNavbar";

function UserLayout() {
  const { pathname } = useLocation();

  const isLoginRegister = pathname === "/login" || pathname === "/register";

  return (
    <SidebarProvider>
      <AppNavbar variant="default" />
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
      <Outlet />
      {!isLoginRegister && <UserFooter />}
    </SidebarProvider>
  );
}

export default UserLayout;
