import { ArrowLeft, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderEstoque() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <Boxes size={18} />
        </div>

        <div>
          <h1>Estoque</h1>
          <p>Controle de entradas e saídas</p>
        </div>
      </div>
    </div>
  );
}