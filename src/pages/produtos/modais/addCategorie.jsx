import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function AddCategorie({ open, onClose }) {
  const [name, setName] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (!name) {
      toast.error("Nome obrigatório");
      return;
    }

    toast.success("Categoria criada");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h2>Nova Categoria</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <input
          placeholder="Nome da categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn-primary" onClick={handleSave}>
          <Save size={16}/> Salvar
        </button>

      </div>
    </div>
  );
}