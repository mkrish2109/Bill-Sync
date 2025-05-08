import { Sidebar } from "flowbite-react";
import React from "react";
import { HiLocationMarker, HiShoppingBag, HiUser } from "react-icons/hi";
import { Link } from "react-router-dom";

const links = [
  { icon: <HiUser />, url: "/user/profile", name: "Profile" },
  { icon: <HiLocationMarker />, url: "/user/address", name: "Address" },
  { icon: <HiShoppingBag />, url: "/user/orders", name: "Orders" },
];

function SildeBarUser() {
  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="w-50  ">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {links.map((value, index) => {
            return (
              <div className="flex flex-col " key={index}>
                <Link to={value.url}>
                  <Sidebar.Item base>
                    <div className="flex items-center gap-2">
                      <div className="[&>svg]:text-xl [[&>svg]:text-gray-900">
                        {value.icon}
                      </div>
                      {value.name}
                    </div>
                  </Sidebar.Item>
                </Link>
              </div>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SildeBarUser;
