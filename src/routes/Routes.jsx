import { Routes, Route, Navigate } from "react-router-dom";

// proteção
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// layout
import AppLayout from "../layout/AppLayout";

// páginas
import Login from "../pages/login/Login";
import Painel from "../pages/painel/Painel";
import Logout from "../components/logout/Logout";
import NotFound from "../components/notFound/NotFound";

export function AppRoutes() {
  return (
    <Routes>

      {/* raiz */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/painel" element={<Painel />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}