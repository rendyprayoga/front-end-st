import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Jika tidak ada user (belum login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Jika role user tidak diizinkan
  if (!allowedRoles.includes(user.role)) {
    // Kalau bukan admin → lempar ke halaman user
    return <Navigate to="/view-product" replace />;
  }

  // Jika role cocok
  return <>{children}</>;
};
