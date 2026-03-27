import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function AddCategorie({ open, onClose }) {
  const [name, setName] = useState("");
  const [active, setActive] = useState(1); // 🔥 status

  if (!open) return null;

  const toggleActive = () => {
    setActive(active ? 0 : 1);
  };

  const handleSave = () => {
    if (!name) {
      toast.error("Nome obrigatório");
      return;
    }

    console.log({
      name,
      is_active: active,
    });

    toast.success("Categoria criada (mock)");
    onClose();

    setName("");
    setActive(1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box"> {/* ✅ IMPORTANTE */}

        {/* HEADER */}
        <div className="modal-header">
          <h2>Nova Categoria</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        {/* FORM */}
        <div className="modal-form">

          {/* INPUT + BOTÃO */}
          <div className="form-row">
            <input
              placeholder="Nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className="modal-inline-button" onClick={handleSave}>
              <Save size={16}/> Salvar
            </button>
          </div>

          {/* STATUS */}
          <div className="modal-status">
            <span>Status:</span>

            <button
              onClick={toggleActive}
              className={`status-toggle ${active ? "active" : "inactive"}`}
            >
              {active ? "Ativo" : "Inativo"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}