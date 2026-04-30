import { useState, useEffect, useMemo, useCallback } from 'react';
import './produtos.css';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api/api';

// Componentes de Layout
import HeaderProdutos from '../../components/produtos/HeaderProdutos';
import TabsProdutos from '../../components/produtos/TabsProdutos';
import SubTabsProdutos from '../../components/produtos/SubTabsProdutos';

// Modais - Padronizando nomes para evitar erro de "not defined"
import AddProduct from '../modais/addProduct';
import EditProduct from '../modais/editProduct';
import AddCategorie from '../modais/addCategorie';
import EditCategory from '../modais/editCategorie';
import AddInsumo from '../modais/addInsumo';
import EditInsumo from '../modais/editInsumo';

// 🔥 REGRA CENTRAL: Proteção contra erro se category for undefined ou nulo
const isInsumoCategory = (category) => {
  return category?.name?.toLowerCase().includes('insumo') || false;
};

export default function Produtos() {
  const [tab, setTab] = useState('itens');
  const [subTab, setSubTab] = useState('produtos');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [openAddInsumo, setOpenAddInsumo] = useState(false);
  const [openEditInsumo, setOpenEditInsumo] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);

  const [modalType, setModalType] = useState('produto');

  // ============================
  // 🔥 FETCH DATA (Envolvido em useCallback para estabilidade)
  // ============================
  const fetchData = useCallback(async () => {
    try {
      const [catRes, prodRes, insRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products'),
        api.get('/insumos'),
      ]);

      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setInsumos(Array.isArray(insRes.data) ? insRes.data : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================
  // 🔥 FILTROS (useMemo evita cálculos desnecessários)
  // ============================
  const produtos = useMemo(() => {
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      return cat && !isInsumoCategory(cat);
    });
  }, [products, categories]);

  const getTotalByCategory = (categoryId) => {
    return products.filter((p) => p.category_id === categoryId).length;
  };

  // ============================
  // 🔥 FUNÇÕES DE EXCLUSÃO
  // ============================
  const handleDeleteCategory = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success('Categoria excluída!');
      fetchData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Erro ao excluir. Verifique dependências.';
      toast.error(message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Deseja realmente excluir este item?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success('Item excluído!');
      fetchData();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Erro ao excluir o item.';
      toast.error(message);
    }
  };

  const handleDeleteInsumo = async (id) => {
    if (!confirm('Deseja realmente excluir este insumo?')) return;

    try {
      await api.delete(`/insumos/${id}`);
      toast.success('Insumo excluído!');
      fetchData();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Erro ao excluir o insumo.';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="products-page loading-container">
        <p>Carregando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <HeaderProdutos />

      <TabsProdutos tab={tab} setTab={setTab} />

      {tab === 'itens' && (
        <SubTabsProdutos subTab={subTab} setSubTab={setSubTab} />
      )}

      <div className="products-content">
        {/* SEÇÃO: PRODUTOS */}
        {tab === 'itens' && subTab === 'produtos' && (
          <>
            <button
              className="btn-primary"
              onClick={() => {
                setModalType('produto');
                setOpenAddProduct(true);
              }}
            >
              + Novo Produto
            </button>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Qtd. Min</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr
                    key={p.id}
                    onDoubleClick={() => {
                      setModalType('produto');
                      setSelectedProduct(p);
                      setOpenEditProduct(true);
                    }}
                  >
                    <td>{p.id}</td>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>
                      R${' '}
                      {p.sale_price ? Number(p.sale_price).toFixed(2) : '0.00'}
                    </td>
                    <td>
                      <strong>{p.min_stock}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-icon-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(p.id);
                        }}
                      >
                        <Trash2 size={18} color="#ff4d4d" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* SEÇÃO: INSUMOS */}
        {tab === 'itens' && subTab === 'insumos' && (
          <>
            <button
              className="btn-primary"
              onClick={() => {
                setOpenAddInsumo(true);
              }}
            >
              + Novo Insumo
            </button>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Unidade</th>
                  <th>Qtd. Min</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {insumos.map((p) => (
                  <tr
                    key={p.id}
                    onDoubleClick={() => {
                      setSelectedInsumo(p);
                      setOpenEditInsumo(true);
                    }}
                  >
                    <td>{p.id}</td>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.unit || 'N/A'}</td>
                    <td>
                      <strong>{p.min_stock}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-icon-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteInsumo(p.id);
                        }}
                      >
                        <Trash2 size={18} color="#ff4d4d" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* SEÇÃO: CATEGORIAS */}
        {tab === 'categorias' && (
          <>
            <button
              className="btn-primary"
              onClick={() => setOpenAddCategory(true)}
            >
              + Nova Categoria
            </button>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Produtos</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    onDoubleClick={() => {
                      setSelectedCategory(cat); // Corrigido: era (c)
                      setOpenEditCategory(true);
                    }}
                  >
                    <td>{cat.id}</td>
                    <td>
                      <strong>{cat.name}</strong>
                    </td>
                    <td>
                      <span
                        className={`status ${cat.is_active ? 'active' : 'inactive'}`}
                      >
                        {cat.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{getTotalByCategory(cat.id)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteCategory(cat.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={18} color="#ff4d4d" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* --- MODAIS --- */}

        {/* Modal de Adicionar Produto/Insumo */}
        <AddProduct
          open={openAddProduct}
          onClose={() => setOpenAddProduct(false)}
          categories={categories}
          onRefresh={fetchData}
          type={modalType}
        />

        {/* Modal de Editar Produto/Insumo */}
        <EditProduct
          open={openEditProduct}
          onClose={() => setOpenEditProduct(false)}
          product={selectedProduct}
          categories={categories}
          onRefresh={fetchData}
          type={modalType}
        />

        {/* Modal de Adicionar Categoria */}
        <AddCategorie
          open={openAddCategory}
          onClose={() => setOpenAddCategory(false)}
          onRefresh={fetchData}
        />

        {/* Modal de Editar Categoria */}
        <EditCategory
          open={openEditCategory}
          onClose={() => setOpenEditCategory(false)}
          category={selectedCategory}
          onRefresh={fetchData}
        />

        <AddInsumo
          open={openAddInsumo}
          onClose={() => setOpenAddInsumo(false)}
          onRefresh={fetchData}
        />

        <EditInsumo
          open={openEditInsumo}
          onClose={() => setOpenEditInsumo(false)}
          insumo={selectedInsumo}
          onRefresh={fetchData}
        />
      </div>
    </div>
  );
}
