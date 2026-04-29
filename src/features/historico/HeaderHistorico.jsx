import { ArrowLeft, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderHistorico() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <History size={18} />
        </div>

        <div>
          <h1>Histórico</h1>
          <p>Registros e movimentações do sistema</p>
        </div>
      </div>
    </div>
  );
}