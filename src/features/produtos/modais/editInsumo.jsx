import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateInsumo } from "../../../services/insumoService";

const UNITS = ["kg", "g", "l", "ml", "und"];

export default function EditInsumo({ open, onClose, insumo, onRefresh }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [minStock, setMinStock] = useState(0);
  const [isActive, setIsActive] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && insumo) {
      setName(insumo.name || "");
      setUnit(insumo.unit || "");
      setMinStock(insumo.min_stock || 0);
      setIsActive(insumo.is_active ? 1 : 0);
    }
  }, [open, insumo]);

  if (!open) return null;

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("O nome do insumo é obrigatório");
      return;
    }

    if (!unit) {
      toast.error("Selecione uma unidade");
      return;
    }

    setLoading(true);
    try {
      await updateInsumo(insumo.id, {
        name: name.trim(),
        unit: unit.trim(),
        min_stock: Number(minStock),
        is_active: Number(isActive),
      });

      toast.success("Insumo atualizado!");
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
          <h2>Editar Insumo</h2>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Unidade</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="">Selecione</option>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Estoque mínimo</label>
            <input
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>

          <div className="status-container">
            <label>Status</label>
            <button
              type="button"
              onClick={() => setIsActive((prev) => (prev === 1 ? 0 : 1))}
              className={`status-toggle ${isActive ? "active" : "inactive"}`}
            >
              {isActive ? "Ativo" : "Inativo"}
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