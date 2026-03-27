import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function EditProduct({ open, onClose, product, categories }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleActive = () => {
    setForm({ ...form, is_active: form.is_active ? 0 : 1 });
  };

  const handleSave = () => {
    if (!form.name) {
      toast.error("Nome obrigatório");
      return;
    }

    if (!form.category_id) {
      toast.error("Categoria obrigatória");
      return;
    }

    toast.success("Produto atualizado (mock)");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h2>Editar Produto</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* NOME */}
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Nome"
        />

        {/* SKU */}
        <input
          name="sku"
          value={form.sku || ""}
          onChange={handleChange}
          placeholder="SKU"
        />

        {/* UNIDADE */}
        <input
          name="unit"
          value={form.unit || ""}
          onChange={handleChange}
          placeholder="Unidade (UN, KG, L...)"
        />

        {/* PREÇO CUSTO */}
        <input
          name="cost_price"
          value={form.cost_price || ""}
          onChange={handleChange}
          placeholder="Preço de custo"
        />

        {/* PREÇO VENDA */}
        <input
          name="sale_price"
          value={form.sale_price || ""}
          onChange={handleChange}
          placeholder="Preço de venda"
        />

        {/* ESTOQUE */}
        <input
          name="min_stock"
          value={form.min_stock || ""}
          onChange={handleChange}
          placeholder="Estoque mínimo"
        />

        {/* CATEGORIA */}
        <select
          name="category_id"
          value={form.category_id || ""}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* STATUS */}
        <div style={{ marginTop: 10 }}>
          <label>Status:</label>

          <button
            onClick={toggleActive}
            style={{
              marginLeft: 10,
              background: form.is_active ? "#22c55e" : "#ef4444",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {form.is_active ? "Ativo" : "Inativo"}
          </button>
        </div>

        {/* SALVAR */}
        <button className="btn-primary" onClick={handleSave}>
          <Save size={16}/> Salvar
        </button>

      </div>
    </div>
  );
}