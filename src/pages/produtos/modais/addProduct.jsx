import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function AddProduct({ open, onClose, categories, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "und",
    cost_price: "",
    sale_price: "",
    resale_price: "",
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

  const handleSave = async () => {
    // 🔥 Validações reais
    if (!form.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }
    if (!form.category_id) {
      toast.error("Selecione uma categoria");
      return;
    }
    if (!form.sale_price) {
      toast.error("Preço de venda é obrigatório");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          // Garante que números vazios sejam enviados como null ou 0 para não quebrar a API
          cost_price: form.cost_price || 0,
          sale_price: form.sale_price || 0,
          resale_price: form.resale_price || 0,
          min_stock: form.min_stock || 0,
        }),
      });

      if (response.ok) {
        toast.success("Produto adicionado com sucesso!");
        
        // Reset do formulário
        setForm({
          name: "",
          sku: "",
          unit: "und",
          cost_price: "",
          sale_price: "",
          resale_price: "",
          min_stock: "",
          category_id: "",
          is_active: 1,
        });

        onRefresh(); // 🔥 Atualiza a lista na tela principal
        onClose();   // Fecha o modal
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar produto");
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
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>Novo Produto / Insumo</h2>
            <p className="modal-subtitle">Preencha as informações do item</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="modal-form">
          {/* NOME */}
          <div className="form-group">
            <label>Nome do Produto</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Pastel de Carne Especial"
              autoFocus
            />
          </div>

          {/* SKU + UNIDADE */}
          <div className="form-row">
            <div className="form-group">
              <label>Código / SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Ex: PST001"
              />
            </div>

            <div className="form-group">
              <label>Unidade de Medida</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="und">Unidade (un)</option>
                <option value="g">Gramas (g)</option>
                <option value="kg">Quilos (kg)</option>
                <option value="l">Litros (l)</option>
                <option value="ml">Mililitros (ml)</option>
              </select>
            </div>
          </div>

          {/* FINANCEIRO 1: CUSTO + QTD MIN */}
          <div className="form-row">
            <div className="form-group">
              <label>Preço de Custo</label>
              <input
                name="cost_price"
                type="number"
                value={form.cost_price}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label>Qtd. Mínima (Estoque)</label>
              <input
                name="min_stock"
                type="number"
                value={form.min_stock}
                onChange={handleChange}
                placeholder="Ex: 10"
              />
            </div>
          </div>

          {/* FINANCEIRO 2: VENDA + REVENDA */}
          <div className="form-row">
            <div className="form-group">
              <label>Preço de Venda</label>
              <input
                name="sale_price"
                type="number"
                value={form.sale_price}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label>Preço de Revenda</label>
              <input
                name="resale_price"
                type="number"
                value={form.resale_price}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </div>

          {/* CATEGORIA */}
          <div className="form-row">
            <div className="form-group categorias-box-add-product">
              <label>Categoria</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FOOTER COM STATUS E BOTÃO */}
          <div className="modal-footer">
            <div className="status-container">
              <label>Status do Produto</label>
              <button
                type="button"
                onClick={toggleActive}
                className={`status-toggle ${form.is_active ? "active" : "inactive"}`}
              >
                <div className="dot"></div>
                {form.is_active ? "Ativo no Sistema" : "Inativo / Oculto"}
              </button>
            </div>

            <button 
              className="modal-button primary" 
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} /> 
              {loading ? "Salvando..." : "Criar Produto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}