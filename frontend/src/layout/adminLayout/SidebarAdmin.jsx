import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import React from "react";
import { HiChartPie, HiPaperClip, HiShoppingBag, HiUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import { MdOutlineBorderColor } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const links = [
  { name: "Dashboard", link: "/admin/dashboard", icon: <HiChartPie /> },
  { name: "Users", link: "/admin/users", icon: <FaUsersCog /> },
  { name: "Account", link: "/admin/account", icon: <HiUser /> },
  { name: "Log Out", icon: <IoLogOut /> },
];

function SidebarAdmin() {
  return (
    <Sidebar
      collapse="button"
      aria-label="Sidebar with multi-level dropdown example"
      className="w-50">
      <SidebarItems>
        <SidebarItemGroup>
          {links.map((value, index) => {
            return (
              <div key={index} className="flex flex-col ">
                <Link to={value.link}>
                  <SidebarItem base>
                    <div className="flex items-center gap-2">
                      <div className="[&>svg]:text-xl [[&>svg]:text-gray-900">
                        {value.icon}
                      </div>
                      {value.name}
                    </div>
                  </SidebarItem>
                </Link>
              </div>
            );
          })}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default SidebarAdmin;
