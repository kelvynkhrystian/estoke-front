import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

export default function AppLayout() {
  return (
    <div>
      <Header />

      <main>
        <Outlet /> {/* 🔥 SEM ISSO NADA RENDERIZA */}
      </main>

      <footer>FOOTER</footer>
    </div>
  );
}