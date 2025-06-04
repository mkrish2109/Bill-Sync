import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserFooter from "./UserFooter";
import "react-toastify/dist/ReactToastify.css";
import { SidebarProvider } from "../../contexts/SidebarContext";
import AppNavbar from "../AppNavbar";

function UserLayout() {
  const { pathname } = useLocation();

  const isLoginRegister = pathname === "/login" || pathname === "/register";

  return (
    <SidebarProvider>
      <AppNavbar variant="default" />
      
      <Outlet />
      {!isLoginRegister && <UserFooter />}
    </SidebarProvider>
  );
}

export default UserLayout;
