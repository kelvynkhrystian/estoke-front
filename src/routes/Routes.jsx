import { Routes, Route } from 'react-router-dom';

// proteção
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// layout
import AppLayout from '../layouts/AppLayout';

// páginas principais
import Login from '../features/login/pages/Login';
import Painel from '../features/painel/pages/Painel';
import Alertas from '../features/alertas/pages/Alertas';

// páginas de componentes
import Caixa from '../features/caixa/pages/Caixa';
import Produtos from '../features/produtos/pages/Produtos';
import Estoque from '../features/estoque/pages/Estoque';
import Pedidos from '../features/pedidos/pages/Pedidos';
import Lojas from '../features/lojas/pages/Lojas';
import Relatorios from '../features/relatorios/pages/Relatorios';
import Perdas from '../features/perdas/pages/Perdas';
import Config from '../features/config/pages/Config';
import Historico from '../features/historico/pages/Historico';

import NotFound from '../components/layout/notFound/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 PÚBLICAS */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* 🔐 PROTEGIDAS */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/painel" element={<Painel />} />
          <Route path="/alertas" element={<Alertas />} />

          {/* módulos */}
          <Route path="/caixa" element={<Caixa />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/pedidos" element={<Pedidos />} />

          <Route path="/lojas" element={<Lojas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/perdas" element={<Perdas />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/config" element={<Config />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
