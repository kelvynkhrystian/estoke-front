import { useState, useMemo, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './modals.css';
import { getInsumos } from '../../../services/insumoService';
import { createProduct } from '../../../services/productService';

export default function AddProduct({
  open,
  onClose,
  categories,
  onRefresh,
  type,
}) {
  const [loading, setLoading] = useState(false);

  const [useInsumos, setUseInsumos] = useState(false);
  const [insumosList, setInsumosList] = useState([]);
  const [insumosData, setInsumosData] = useState([]);

  useEffect(() => {
    if (useInsumos) {
      loadInsumos();
    }
  }, [useInsumos]);

  const removeInsumoRow = (index) => {
    setInsumosData((prev) => prev.filter((_, i) => i !== index));
  };

  const loadInsumos = async () => {
    try {
      const res = await getInsumos();
      setInsumosList(res.data);
    } catch {
      toast.error('Erro ao carregar insumos');
    }
  };

  const addInsumoRow = () => {
    setInsumosData((prev) => [...prev, { insumo_id: '', quantity: '' }]);
  };

  const handleInsumoChange = (index, field, value) => {
    const updated = [...insumosData];
    updated[index][field] = value;
    setInsumosData(updated);
  };

  const initialForm = {
    name: '',
    sku: '',
    unit: 'und',
    cost_price: '',
    sale_price: '',
    resale_price: '',
    min_stock: '',
    category_id: '',
    is_active: 1,
  };

  const [form, setForm] = useState(initialForm);

  // 1. FILTRO DE CATEGORIAS: Separa o que é insumo do que é produto
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const isIns = cat.name.toLowerCase().includes('insumo');
      return type === 'insumo' ? isIns : !isIns;
    });
  }, [categories, type]);

  // 2. AUTO-SELEÇÃO: Se houver apenas uma categoria disponível no filtro, já seleciona ela
  useEffect(() => {
    if (open && filteredCategories.length === 1) {
      setForm((prev) => ({ ...prev, category_id: filteredCategories[0].id }));
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
    // 🔎 Validações
    if (!form.name.trim()) {
      toast.error(`Nome do ${type} é obrigatório`);
      return;
    }

    if (!form.category_id) {
      toast.error('Selecione uma categoria');
      return;
    }

    if (type === 'produto' && !form.sale_price) {
      toast.error('Preço de venda é obrigatório para produtos');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,

        // 🔢 Sanitização
        cost_price: parseFloat(form.cost_price) || 0,
        sale_price: parseFloat(form.sale_price) || 0,
        resale_price: parseFloat(form.resale_price) || 0,
        min_stock: parseFloat(form.min_stock) || 0,

        type,

        // 🔥 INSUMOS (AQUI ESTÁ O DIFERENCIAL)
        insumos: useInsumos
          ? insumosData
              .filter((i) => i.insumo_id && i.quantity)
              .map((i) => ({
                insumo_id: i.insumo_id,
                quantity: parseFloat(i.quantity),
              }))
          : [],
      };

      await createProduct(payload);

      toast.success(`${type === 'insumo' ? 'Insumo' : 'Produto'} adicionado!`);

      setForm(initialForm);
      setInsumosData([]); // 🔥 limpa os ingredientes também
      setUseInsumos(false);

      onRefresh();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Erro ao salvar';

      toast.error('Erro: ' + message);
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
            <h2>Novo {type === 'insumo' ? 'Insumo' : 'Produto'}</h2>
            <p className="modal-subtitle">
              Preencha os dados de {type === 'insumo' ? 'insumo' : 'venda'}
            </p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label>Nome do {type === 'insumo' ? 'Insumo' : 'Produto'}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={
                type === 'insumo'
                  ? 'Ex: Farinha de Trigo'
                  : 'Ex: Pastel de Carne'
              }
              autoFocus
            />
          </div>

          <div className="form-row addcodigo">
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
              <label>Medida</label>
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
                min="0"
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
                min="0"
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
                min="0"
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
                min="0"
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
                className={`status-toggle ${form.is_active ? 'active' : 'inactive'}`}
              >
                <div className="dot"></div>
                {form.is_active ? 'Ativo' : 'Inativo'}
              </button>
            </div>

            <div className="status-container">
              <label>Adicionar Ingredientes?</label>
              <button
                type="button"
                onClick={() => setUseInsumos((prev) => !prev)}
                className={`status-toggle ${useInsumos ? 'active' : 'inactive'}`}
              >
                {useInsumos ? 'SIM' : 'NÃO'}
              </button>
            </div>

            {useInsumos && (
              <div className="insumos-container">
                {insumosData.map((item, index) => {
                  const selected = insumosList.find(
                    (i) => i.id === item.insumo_id,
                  );

                  return (
                    <div
                      key={index}
                      className="form-row ingredientes-box"
                      style={{ alignItems: 'center' }}
                    >
                      {/* SELECT */}
                      <select
                        value={item.insumo_id}
                        onChange={(e) =>
                          handleInsumoChange(
                            index,
                            'insumo_id',
                            Number(e.target.value),
                          )
                        }
                      >
                        <option value="">Selecione</option>
                        {insumosList.map((ins) => (
                          <option key={ins.id} value={ins.id}>
                            {ins.name}
                          </option>
                        ))}
                      </select>

                      {/* QUANTIDADE */}
                      <input
                        type="number"
                        min="0"
                        placeholder="Qtd"
                        value={item.quantity}
                        onChange={(e) =>
                          handleInsumoChange(index, 'quantity', e.target.value)
                        }
                      />

                      {/* UNIDADE */}
                      <input value={selected?.unit || ''} disabled />

                      {/* ❌ BOTÃO REMOVER */}
                      <button
                        type="button"
                        onClick={() => removeInsumoRow(index)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ff4d4f',
                        }}
                      >
                        <X size={25} />
                      </button>
                    </div>
                  );
                })}

                <button onClick={addInsumoRow} className="modal-button">
                  + Adicionar ingrediente
                </button>
              </div>
            )}

            <button
              className="modal-button primary"
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} />
              {loading
                ? 'Salvando...'
                : `Criar ${type === 'insumo' ? 'Insumo' : 'Produto'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
