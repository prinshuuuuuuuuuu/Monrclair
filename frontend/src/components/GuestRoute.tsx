import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface GuestRouteProps {
  redirectPath?: string;
  adminOnly?: boolean;
}

const GuestRoute = ({
  redirectPath = "/",
  adminOnly = false,
}: GuestRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-[10px] tracking-luxury uppercase animate-pulse">
          Checking Session Protocol...
        </p>
      </div>
    );
  }

  if (user) {
    if (adminOnly) {
      // If going to admin login but already an admin, go to dashboard
      if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
      }
      // If going to admin login but a regular user, maybe let them login as admin?
      // Or redirect them to home. Usually, it's better to let them see the login
      // if they need to switch to an admin account.
      // However, if the requirement is "don't show login if logged in",
      // then we should redirect.
      return <Navigate to="/" replace />;
    }

    // For regular /auth route
    return (
      <Navigate to={user.role === "admin" ? "/admin" : redirectPath} replace />
    );
  }

  return <Outlet />;
};

export default GuestRoute;
