import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    // 🔥 allow correct role
    if (allowedRole && role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;