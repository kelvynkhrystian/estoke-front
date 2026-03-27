
import { useState, useMemo, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function EditProduct({ open, onClose, product, categories, onRefresh, type }) {
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

  // 1. SINCRONIZAÇÃO: Preenche o formulário quando o produto é selecionado
  useEffect(() => {
    if (open && product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        unit: product.unit || "und",
        // Garantimos que valores numéricos vazios virem string vazia para o input
        cost_price: product.cost_price ?? "",
        sale_price: product.sale_price ?? "",
        resale_price: product.resale_price ?? "",
        min_stock: product.min_stock ?? "",
        category_id: product.category_id || "",
        is_active: product.is_active ? 1 : 0,
      });
    }
  }, [open, product]);

  // 2. FILTRO DE CATEGORIAS: Mantém a lógica de separar Produto de Insumo
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const isIns = cat.name.toLowerCase().includes("insumo");
      return type === "insumo" ? isIns : !isIns;
    });
  }, [categories, type]);

  if (!open || !product) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleActive = () => {
    setForm({ ...form, is_active: form.is_active ? 0 : 1 });
  };

  const handleUpdate = async () => {
    // Validações básicas
    if (!form.name.trim()) {
      toast.error(`Nome do ${type} é obrigatório`);
      return;
    }
    if (!form.category_id) {
      toast.error("Selecione uma categoria");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          cost_price: parseFloat(form.cost_price) || 0,
          sale_price: parseFloat(form.sale_price) || 0,
          resale_price: parseFloat(form.resale_price) || 0,
          min_stock: parseFloat(form.min_stock) || 0,
          type: type 
        }),
      });

      if (response.ok) {
        toast.success(`${type === "insumo" ? "Insumo" : "Produto"} atualizado!`);
        onRefresh(); 
        onClose();
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
          <div>
            <h2>Editar {type === "insumo" ? "Insumo" : "Produto"}</h2>
            <p className="modal-subtitle">ID: {product.id} • Alterar informações do item</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nome do {type === "insumo" ? "Insumo" : "Produto"}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Nome do item"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Código / SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Ex: SKU001"
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

          <div className="form-row">
            <div className="form-group">
              <label>Preço de Custo (R$)</label>
              <input
                name="cost_price"
                type="number"
                value={form.cost_price}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Qtd. Mínima (Estoque)</label>
              <input
                name="min_stock"
                type="number"
                value={form.min_stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preço de Venda (R$)</label>
              <input
                name="sale_price"
                type="number"
                value={form.sale_price}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Preço de Revenda (R$)</label>
              <input
                name="resale_price"
                type="number"
                value={form.resale_price}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoria de {type === "insumo" ? "Insumos" : "Venda"}</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <div className="status-container">
              <label>Status do Item</label>
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
              onClick={handleUpdate}
              disabled={loading}
            >
              <Save size={18} /> 
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}