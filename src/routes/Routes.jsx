import { Routes, Route } from 'react-router-dom';

// proteção
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// layout
import AppLayout from '../layout/AppLayout';

// páginas principais
import Login from '../pages/login/Login';
import Painel from '../pages/painel/Painel';
import Alertas from '../pages/alertas/Alertas';

// páginas de componentes
import Caixa from '../features/caixa/pages/caixa/Caixa';
import Produtos from '../features/produtos/pages/produtos/Produtos';
import Estoque from '../features/estoque/pages/estoque/Estoque';
import Pedidos from '../features/pedidos/pages/pedidos/Pedidos';
import Lojas from '../features/lojas/pages/Lojas';
import Relatorios from '../features/relatorios/pages/relatorios/Relatorios';
import Perdas from '../features/perdas/pages/perdas/Perdas';
import Config from '../features/config/pages/config/Config';
import Historico from '../features/historico/pages/historico/Historico';

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
