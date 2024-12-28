import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/FakeAuth";
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) return navigate("/");
  }, [isAuthenticated, navigate]);
  return isAuthenticated ? children : null;
}
