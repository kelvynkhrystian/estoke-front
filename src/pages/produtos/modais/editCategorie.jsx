import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function EditCategorie({ open, onClose, category }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  if (!open) return null;

  const handleSave = () => {
    toast.success("Categoria atualizada");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h2>Editar Categoria</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <input value={name} onChange={(e) => setName(e.target.value)} />

        <button className="btn-primary" onClick={handleSave}>
          <Save size={16}/> Atualizar
        </button>

      </div>
    </div>
  );
}