import { ArrowLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderRelatorios() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <BarChart3 size={18} />
        </div>

        <div>
          <h1>Relatórios</h1>
          <p>Análise de desempenho e dados</p>
        </div>
      </div>
    </div>
  );
}