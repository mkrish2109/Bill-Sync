// layouts/LayoutAdmin.js
import { Outlet } from "react-router-dom";
import Backdrop from "../Backdrop";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import Sidebar from "../SideBar";
import AppNavbar from "../AppNavbar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex bg-background-surfaceLight dark:bg-background-surfaceDark">
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
        <div className="p-4 mx-auto max-w-7xl md:p-6 dark:bg-background-surfaceDark">
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
