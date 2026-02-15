import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  console.log("ProtectedRoute isLoggedIn:", isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
