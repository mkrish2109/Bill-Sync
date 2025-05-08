import React from "react";
import { Outlet } from "react-router-dom";
import SildeBarUser from "./SildeBarUser";

function LayoutUser() {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      {/* <SildeBarUser /> */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutUser;
