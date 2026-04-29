import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditCategory({ open, onClose, category, onRefresh }) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 Sincroniza os campos com a categoria selecionada ao abrir o modal
  useEffect(() => {
    if (open && category) {
      setName(category.name || "");
      setIsActive(category.is_active ? 1 : 0);
    }
  }, [open, category]);

  if (!open) return null;

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("O nome da categoria é obrigatório");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Usamos o método PUT e passamos o ID da categoria na URL
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: name, 
          is_active: isActive 
        }),
      });

      if (response.ok) {
        toast.success("Categoria atualizada com sucesso!");
        onRefresh(); // Atualiza a lista no Produtos.jsx
        onClose();   // Fecha o modal
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar");
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
          <h2>Editar Categoria</h2>
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