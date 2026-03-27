import { useState } from "react";
import { X, Save, Plus } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function AddProduct({ open, onClose, categories }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    cost_price: "",
    sale_price: "",
    min_stock: "",
    category_id: "",
    is_active: 1,
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleActive = () => {
    setForm({ ...form, is_active: form.is_active ? 0 : 1 });
  };

  const handleSave = () => {
    // 🔥 validação
    if (!form.name) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!form.category_id) {
      toast.error("Selecione uma categoria");
      return;
    }

    if (!form.sale_price) {
      toast.error("Preço de venda obrigatório");
      return;
    }

    // 🔥 aqui depois entra API
    console.log("Novo produto:", form);

    toast.success("Produto criado (mock)");

    onClose();

    // reset
    setForm({
      name: "",
      sku: "",
      unit: "",
      cost_price: "",
      sale_price: "",
      min_stock: "",
      category_id: "",
      is_active: 1,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Novo Produto</h2>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="modal-form">

          <div className="form-grid">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome do produto"
            />

            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="SKU (ex: PST001)"
            />

            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Unidade (UN, KG, L...)"
            />

            <input
              name="cost_price"
              value={form.cost_price}
              onChange={handleChange}
              placeholder="Preço de custo"
            />

            <input
              name="sale_price"
              value={form.sale_price}
              onChange={handleChange}
              placeholder="Preço de venda"
            />

            <input
              name="min_stock"
              value={form.min_stock}
              onChange={handleChange}
              placeholder="Estoque mínimo"
            />

          </div>

          {/* SELECT */}
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="modal-select"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <div className="modal-status">
            <span>Status:</span>

            <button
              onClick={toggleActive}
              className={`status-toggle ${form.is_active ? "active" : "inactive"}`}
            >
              {form.is_active ? "Ativo" : "Inativo"}
            </button>
          </div>

          {/* ACTION */}
          <button className="modal-button" onClick={handleSave}>
            <Save size={16} />
            Criar Produto
          </button>

        </div>
      </div>
    </div>
  );

  
}