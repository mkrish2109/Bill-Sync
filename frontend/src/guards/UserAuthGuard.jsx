import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function UserAuthGuard({ children }) {
  const user = useSelector((store) => {
    return store.user.user;
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
}

export default UserAuthGuard;
