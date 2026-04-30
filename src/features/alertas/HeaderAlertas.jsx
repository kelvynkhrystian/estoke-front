import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeaderAlertas() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <button className="products-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </button>

      <div className="products-title">
        <div className="products-icon">
          <Bell size={18} />
        </div>

        <div>
          <h1>Alertas</h1>
          <p>Notificações e avisos importantes</p>
        </div>
      </div>
    </div>
  );
}
