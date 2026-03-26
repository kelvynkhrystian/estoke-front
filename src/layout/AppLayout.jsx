import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

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