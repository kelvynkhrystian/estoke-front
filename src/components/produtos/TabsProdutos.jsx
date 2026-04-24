import { Boxes, Tags } from "lucide-react";

export default function TabsProdutos({ tab, setTab }) {
  return (
    <div className="products-tabs">

      <button
        className={`products-tab ${tab === "itens" ? "active" : ""}`}
        onClick={() => setTab("itens")}
      >
        <Boxes size={16} />
        Itens
      </button>

      <button
        className={`products-tab ${tab === "categorias" ? "active" : ""}`}
        onClick={() => setTab("categorias")}
      >
        <Tags size={16} />
        Categorias
      </button>

    </div>
  );
}