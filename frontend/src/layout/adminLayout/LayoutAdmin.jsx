// layouts/LayoutAdmin.js
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "../Backdrop";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import Sidebar from "../SideBar";
import AppNavbar from "../AppNavbar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex bg-background-secondaryLight dark:bg-background-secondaryDark">
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
      
      <div>
        <Sidebar />
        <Backdrop />
      </div>
      
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppNavbar variant="admin" showSidebarToggle={true} />
        <div className="p-4 mx-auto max-w-7xl md:p-6 dark:bg-background-secondaryDark">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const LayoutAdmin = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default LayoutAdmin;