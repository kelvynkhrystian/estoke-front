// import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Wallet,
  Package,
  Boxes,
  Bell,
  ClipboardList,
  Store,
  FileText,
  TriangleAlert,
  ShoppingCart,
  History,
} from 'lucide-react';

import './painel.css';

const resumoCards = [
  {
    title: 'Vendas do dia',
    value: 'R$ 3.254,00',
    subtitle: 'Hoje — 60 vendas',
    icon: ShoppingCart,
  },
  {
    title: 'Total em caixa',
    value: 'R$ 3.254,00',
    subtitle: 'Atualizado agora',
    icon: Wallet,
  },
];

const atalhos = [
  // { title: 'Caixa', icon: Wallet, to: '/caixa' },
  { title: 'Produtos', icon: Package, to: '/produtos' },
  { title: 'Estoque', icon: Boxes, to: '/estoque' },
  // { title: 'Pedidos', icon: ClipboardList, to: '/pedidos' },
  { title: 'Lojas', icon: Store, to: '/lojas' },
  { title: 'Perdas', icon: TriangleAlert, to: '/perdas' },
  { title: 'Relatórios', icon: FileText, to: '/relatorios' },
  { title: 'Histórico', icon: History, to: '/historico' },
  { title: 'Configurações', icon: Settings, to: '/config' },
];

const alertas = [
  { title: 'Estoque mínimo', desc: '10 produtos' },
  { title: 'Notas pendentes', desc: '2 notas' },
  { title: 'Produtos vencendo', desc: '5 lotes (7 dias)' },
  { title: 'Transferências em aberto', desc: '3 solicitações' },
  { title: 'Inventário pendente', desc: 'Rua A - Setor 2' },
];

export default function Painel() {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="painel-page">
      <main className="painel-content">
        <section className="painel-hero">
          <h1>Sistema de Gerenciamento</h1>
          <p>
            Seja bem-vindo. Aqui você acompanha os principais atalhos e
            indicadores.
          </p>
        </section>

        <section className="painel-resumo-grid">
          {resumoCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="painel-resumo-card">
                <div className="painel-card-top">
                  <span>{card.title}</span>
                  <Icon size={20} />
                </div>

                <strong>{card.value}</strong>
                <p>{card.subtitle}</p>
              </article>
            );
          })}
        </section>

        <section className="painel-atalhos">
          {atalhos.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="painel-atalho-card"
              >
                <div className="painel-atalho-icon">
                  <Icon size={26} />
                </div>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </section>

        <section className="painel-alertas-card">
          {/* HEADER NOVO */}
          <div className="painel-alertas-header">
            <div className="alertas-title">
              <h2>Alertas</h2>
            </div>

            <div className="alertas-actions">
              <Bell size={18} />
              <span className="badge-alerta">{alertas.length}</span>
            </div>
          </div>

          <div className="painel-alertas-list">
            {alertas.map((alerta) => (
              <div key={alerta.title} className="painel-alerta-item">
                <strong>{alerta.title}</strong>
                <span>{alerta.desc}</span>
              </div>
            ))}
          </div>

          <Link to="/alertas" className="painel-alertas-button">
            Ver todos
          </Link>
        </section>
      </main>
    </div>
  );
}
