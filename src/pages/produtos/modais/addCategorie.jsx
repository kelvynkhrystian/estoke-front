import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AddCategory({ open, onClose, onRefresh }) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [loading, setLoading] = useState(false);

  // Se o modal não estiver aberto, não renderiza nada
  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("O nome da categoria é obrigatório");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Autenticação corrigida
        },
        body: JSON.stringify({ 
          name: name, 
          is_active: isActive 
        }),
      });

      if (response.ok) {
        toast.success("Categoria adicionada com sucesso!");
        setName(""); // Limpa o campo
        setIsActive(1); // Reseta o status
        onRefresh(); // 🔥 Chama a função que você passou no Produtos.jsx para atualizar a lista
        onClose();   // Fecha o modal
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar");
      }
    } catch (error) {
      toast.error("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box glass">
        <div className="modal-header">
          <h2>Nova Categoria</h2>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nome da categoria</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bebidas, Doces..."
              autoFocus
            />
          </div>

          <div className="status-container">
            <label>Status da Categoria</label>
            <button 
              type="button"
              onClick={() => setIsActive(isActive === 1 ? 0 : 1)}
              className={`status-toggle ${isActive ? "active" : "inactive"}`}
            >
              {isActive ? "Ativo no Sistema" : "Inativo / Oculto"}
            </button>
          </div>

          <button 
            className="modal-button primary" 
            onClick={handleSave}
            disabled={loading}
          >
            <Save size={18} /> 
            {loading ? "Salvando..." : "Salvar Categoria"}
          </button>
        </div>
      </div>
    </div>
  );
}