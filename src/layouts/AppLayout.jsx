import { Outlet } from 'react-router-dom';
import Header from '../components/layout/header/Header';
import Footer from '../components/layout/footer/Footer';

export default function AppLayout() {
  return (
    <div>
      <Header />

      <main>
        <Outlet /> {/* 🔥 SEM ISSO NADA RENDERIZA */}
      </main>

      <Footer />
    </div>
  );
}
