import { useState, useMemo, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function AddProduct({ open, onClose, categories, onRefresh, type }) {
  const [loading, setLoading] = useState(false);
  
  const initialForm = {
    name: "",
    sku: "",
    unit: "und",
    cost_price: "",
    sale_price: "",
    resale_price: "",
    min_stock: "",
    category_id: "",
    is_active: 1,
  };

  const [form, setForm] = useState(initialForm);

  // 1. FILTRO DE CATEGORIAS: Separa o que é insumo do que é produto
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const isIns = cat.name.toLowerCase().includes("insumo");
      return type === "insumo" ? isIns : !isIns;
    });
  }, [categories, type]);

  // 2. AUTO-SELEÇÃO: Se houver apenas uma categoria disponível no filtro, já seleciona ela
  useEffect(() => {
    if (open && filteredCategories.length === 1) {
      setForm(prev => ({ ...prev, category_id: filteredCategories[0].id }));
    }
  }, [open, filteredCategories]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleActive = () => {
    setForm({ ...form, is_active: form.is_active ? 0 : 1 });
  };

  const handleSave = async () => {
    // Validações
    if (!form.name.trim()) {
      toast.error(`Nome do ${type} é obrigatório`);
      return;
    }
    if (!form.category_id) {
      toast.error("Selecione uma categoria");
      return;
    }
    
    // Se for PRODUTO, o preço de venda é essencial. Se for INSUMO, pode ser opcional.
    if (type === "produto" && !form.sale_price) {
      toast.error("Preço de venda é obrigatório para produtos");
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
          // Sanitização de números para a API
          cost_price: parseFloat(form.cost_price) || 0,
          sale_price: parseFloat(form.sale_price) || 0,
          resale_price: parseFloat(form.resale_price) || 0,
          min_stock: parseFloat(form.min_stock) || 0,
          type: type // Enviando o tipo para o backend se necessário
        }),
      });

      if (response.ok) {
        toast.success(`${type === "insumo" ? "Insumo" : "Produto"} adicionado!`);
        setForm(initialForm); // Reset completo
        onRefresh(); 
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar");
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
        {/* HEADER DINÂMICO */}
        <div className="modal-header">
          <div>
            <h2>Novo {type === "insumo" ? "Insumo" : "Produto"}</h2>
            <p className="modal-subtitle">Preencha os dados de {type === "insumo" ? "insumo" : "venda"}</p>
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
              placeholder={type === "insumo" ? "Ex: Farinha de Trigo" : "Ex: Pastel de Carne"}
              autoFocus
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
              <label>Qtd. Mínima</label>
              <input
                name="min_stock"
                type="number"
                value={form.min_stock}
                onChange={handleChange}
                placeholder="Aviso de reposição"
              />
            </div>
          </div>

          {/* SÓ MOSTRA PREÇO DE VENDA SE NÃO FOR INSUMO PURO (OPCIONAL) */}
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

          <div className="form-group">
            <label>Categoria</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Selecione a categoria de {type}</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <div className="status-container">
              <label>Status</label>
              <button
                type="button"
                onClick={toggleActive}
                className={`status-toggle ${form.is_active ? "active" : "inactive"}`}
              >
                <div className="dot"></div>
                {form.is_active ? "Ativo" : "Inativo"}
              </button>
            </div>

            <button 
              className="modal-button primary" 
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} /> 
              {loading ? "Salvando..." : `Criar ${type === "insumo" ? "Insumo" : "Produto"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}