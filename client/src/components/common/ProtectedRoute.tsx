import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { ReactNode } from "react"; 

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const token = useSelector((s: RootState) => s.auth.token);

  if (!token) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
