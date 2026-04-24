import { ArrowLeft, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderProdutos() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <Package size={18} />
        </div>

        <div>
          <h1>Produtos</h1>
          <p>Gerencie produtos, insumos e categorias</p>
        </div>
      </div>

    </div>
  );
}