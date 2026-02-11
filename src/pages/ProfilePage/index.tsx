import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

/**
 * ProfilePage - Auto-redirect to correct profile based on role
 * /account → /account/user (TOURIST, ADMIN)
 * /account → /account/vendor (VENDOR)
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === UserRole.VENDOR) {
        navigate('/vendor/profile', { replace: true });
      } else {
        // TOURIST or ADMIN go to user profile
        navigate('/account/user', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking role
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
};

export default ProfilePage;
