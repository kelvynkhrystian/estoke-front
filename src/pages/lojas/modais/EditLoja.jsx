import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateStore } from "../../../services/storeService";

export default function EditLoja({ open, onClose, store, onRefresh }) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && store) {
      setName(store.name || "");
      setIsActive(store.is_active ? 1 : 0);
    }
  }, [open, store]);

  if (!open) return null;

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("O nome da loja é obrigatório");
      return;
    }

    setLoading(true);
    try {
      await updateStore(store.id, {
        name: name.trim(),
        is_active: Number(isActive),
      });

      toast.success("Loja atualizada com sucesso!");
      onRefresh();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Erro ao atualizar";
      toast.error("Erro: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box glass">
        <div className="modal-header">
          <h2>Editar Loja</h2>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nome da loja</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Loja Centro..."
              autoFocus
            />
          </div>

          <div className="status-container">
            <label>Status da Loja</label>
            <button
              type="button"
              onClick={() => setIsActive(isActive === 1 ? 0 : 1)}
              className={`status-toggle ${isActive ? "active" : "inactive"}`}
            >
              {isActive ? "Ativa no Sistema" : "Inativa / Oculta"}
            </button>
          </div>

          <button
            className="modal-button primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Atualizando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}