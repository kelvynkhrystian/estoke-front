import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderPedidos() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <ShoppingCart size={18} />
        </div>

        <div>
          <h1>Pedidos</h1>
          <p>Gerencie pedidos e vendas</p>
        </div>
      </div>
    </div>
  );
}