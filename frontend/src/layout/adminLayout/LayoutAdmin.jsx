// LayoutAdmin.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LayoutAdmin() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavbarAdmin />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex pt-16">
        <SidebarAdmin />
        <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LayoutAdmin;