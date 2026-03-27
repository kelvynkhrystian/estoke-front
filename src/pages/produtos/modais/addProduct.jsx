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
      <div className="modal-box glass">
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>Novo Produto</h2>
            <p className="modal-subtitle">Preencha as informações básicas do item</p>
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
              <label>Tipo     </label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="und">Unidade</option>
                <option value="g">Gramas</option>
                <option value="kg">Quilos</option>
                <option value="l">Litros</option>
              </select>
            </div>
          </div>

          {/* FINANCEIRO: CUSTO, VENDA E REVENDA */}
          <div className="form-row three-cols">
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
              <label>Estoque Mínimo</label>
              <input
                name="min_stock"
                type="number"
                value={form.min_stock}
                onChange={handleChange}
                placeholder="Aviso de reposição"
              />
            </div>   

            

          {/* ESTOQUE + CATEGORIA */}
          
          

            
          </div>

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

          {/* STATUS E AÇÕES */}
          <div className="modal-footer">
            <div className="status-container">
              <label>Status do Produto</label>
              <button
                onClick={toggleActive}
                className={`status-toggle ${form.is_active ? "active" : "inactive"}`}
              >
                <div className="dot"></div>
                {form.is_active ? "Ativo no Sistema" : "Inativo / Oculto"}
              </button>
            </div>

            <button className="modal-button primary" onClick={handleSave}>
              <Save size={18} /> Criar Produto
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  
}