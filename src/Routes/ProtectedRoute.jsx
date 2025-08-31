import { Navigate } from "react-router-dom";
import { useUser } from "../Providers/UserProvider";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This ensures we wait for user data to be loaded
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user || user?.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;