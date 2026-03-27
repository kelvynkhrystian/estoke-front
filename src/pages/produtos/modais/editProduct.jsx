import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import "./modals.css";

export default function EditProduct({ open, onClose, categories, product }) {
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

  // 🔥 Carrega os dados do produto quando o modal abre ou o produto muda
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        unit: product.unit || "und",
        cost_price: product.cost_price || "",
        sale_price: product.sale_price || "",
        resale_price: product.resale_price || "",
        min_stock: product.min_stock || "",
        category_id: product.category_id || "",
        is_active: product.is_active ?? 1,
      });
    }
  }, [product, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleActive = () => {
    setForm({ ...form, is_active: form.is_active ? 0 : 1 });
  };

  const handleSave = () => {
    if (!form.name || !form.category_id || !form.sale_price) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }

    // 🔥 Aqui você chamaria sua API de Update enviando (product.id, form)
    console.log("Editando produto ID:", product.id, form);
    toast.success("Alterações salvas com sucesso!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box glass">
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>Editar Produto</h2>
            <p className="modal-subtitle">ID: #{product?.id} - Altere as informações necessárias</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="modal-form">
          
          <div className="form-group">
            <label>Nome do Produto</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Código / SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="und">Unidade</option>
                <option value="g">Gramas</option>
                <option value="kg">Quilos</option>
                <option value="l">Litros</option>
              </select>
            </div>
          </div>

          <div className="form-row three-cols">
            <div className="form-group">
              <label>Preço de Custo</label>
              <input
                name="cost_price"
                type="number"
                value={form.cost_price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Estoque Mínimo</label>
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
              <label>Preço de Venda</label>
              <input
                name="sale_price"
                type="number"
                value={form.sale_price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Preço de Revenda</label>
              <input
                name="resale_price"
                type="number"
                value={form.resale_price}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group categorias-box-add-product">
              <label>Categoria</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <div className="status-container">
              <label>Status do Produto</label>
              <button
                onClick={toggleActive}
                className={`status-toggle ${form.is_active ? "active" : "inactive"}`}
              >
                <div className="dot"></div>
                {form.is_active ? "Ativo" : "Inativo"}
              </button>
            </div>

            <button className="modal-button primary" onClick={handleSave}>
              <Save size={18} /> Salvar Alterações
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}



