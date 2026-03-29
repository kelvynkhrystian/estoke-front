import { ArrowLeft, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderLojas() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <Store size={18} />
        </div>

        <div>
          <h1>Lojas</h1>
          <p>Gerencie suas unidades</p>
        </div>
      </div>
    </div>
  );
}