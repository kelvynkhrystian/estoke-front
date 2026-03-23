import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header>HEADER</header>

      <main>
        <Outlet /> {/* 🔥 SEM ISSO NADA RENDERIZA */}
      </main>

      <footer>FOOTER</footer>
    </div>
  );
}