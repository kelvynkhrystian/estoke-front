import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { createCategory } from "../../../services/categoryService";

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
      await createCategory({
        name: name.trim(),
        is_active: Number(isActive),
      });

      toast.success("Categoria adicionada com sucesso!");
      setName("");
      setIsActive(1);
      onRefresh();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Erro ao salvar";
      toast.error("Erro: " + message);
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
              onClick={() => setIsActive((prev) => (prev === 1 ? 0 : 1))}
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