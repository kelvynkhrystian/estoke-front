import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderPerdas() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <AlertTriangle size={18} />
        </div>

        <div>
          <h1>Perdas</h1>
          <p>Controle de desperdícios e perdas</p>
        </div>
      </div>
    </div>
  );
}