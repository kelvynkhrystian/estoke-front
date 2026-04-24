import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (isAuthenticated) {
    return <Navigate to="/painel" replace />;
  }

  return <Outlet />;
}