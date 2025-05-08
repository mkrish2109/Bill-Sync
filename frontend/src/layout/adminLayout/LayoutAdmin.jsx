import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";
import { ToastContainer } from "react-toastify";
import NavUser from "../userLayout/NavUser";

function LayoutAdmin() {
  return (
    <div>
      <NavUser />
      <ToastContainer closeOnClick />
      <div className="grid grid-cols-[256px_1fr]">
        <SidebarAdmin />
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutAdmin;
