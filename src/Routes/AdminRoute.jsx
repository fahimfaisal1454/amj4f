import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Providers/UserProvider";

const AdminRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  // Check if user is logged in AND role is Admin
  if (user?.username && user.role === "Admin") {
    return children;
  }

  // Not logged in or not admin: redirect to login or show access denied
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default AdminRoute;
