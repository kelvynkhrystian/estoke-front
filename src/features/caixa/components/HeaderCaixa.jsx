import { ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeaderCaixa() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <Wallet size={18} />
        </div>

        <div>
          <h1>Caixa</h1>
          <p>Controle financeiro e movimentações</p>
        </div>
      </div>
    </div>
  );
}
