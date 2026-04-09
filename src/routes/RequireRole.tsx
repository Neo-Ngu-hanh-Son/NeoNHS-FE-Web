import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, type UserRole as UserRoleType } from "@/types";

interface RequireRoleProps {
  allowedRoles: readonly UserRoleType[];
  children: ReactNode;
}

/**
 * Guards children so only users with an allowed role can see them.
 * Wrong role → redirect to that role’s home (or `/` for tourists).
 * Unauthenticated → `/login` with return path in location state.
 */
export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  const role = user.role;
  if (!allowedRoles.includes(role)) {
    if (role === UserRole.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (role === UserRole.VENDOR) {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
