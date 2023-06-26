import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ isAdmin, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (isAuthenticated === false) {
    console.log("1111111111111");
    return <Navigate to="/login" />;
  }
  if (isAdmin === true && user?.role && user.role !== "admin") {
    console.log("222222222222");
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
