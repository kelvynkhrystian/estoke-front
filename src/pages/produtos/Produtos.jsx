import { useState, useEffect, useMemo, useCallback } from "react";
import "./produtos.css";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Componentes de Layout
import HeaderProdutos from "../../components/produtos/HeaderProdutos";
import TabsProdutos from "../../components/produtos/TabsProdutos";
import SubTabsProdutos from "../../components/produtos/SubTabsProdutos";

// Modais - Padronizando nomes para evitar erro de "not defined"
import AddProduct from "./modais/addProduct";
import EditProduct from "./modais/editProduct";
import AddCategorie from "./modais/addCategorie";
import EditCategory from "./modais/editCategorie"; // 🔥 Importado como EditCategory para combinar com o return

// 🔥 REGRA CENTRAL: Proteção contra erro se category for undefined ou nulo
const isInsumoCategory = (category) => {
  return category?.name?.toLowerCase().includes("insumo") || false;
};

export default function Produtos() {
  const [tab, setTab] = useState("itens");
  const [subTab, setSubTab] = useState("produtos");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [modalType, setModalType] = useState("produto");

  // Configuração da API
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ============================
  // 🔥 FETCH DATA (Envolvido em useCallback para estabilidade)
  // ============================
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [catRes, prodRes] = await Promise.all([
        fetch(`${API_URL}/categories`, { headers }),
        fetch(`${API_URL}/products`, { headers }),
      ]);

      if (!catRes.ok || !prodRes.ok) throw new Error("Erro na API");

      const cats = await catRes.json();
      const prods = await prodRes.json();

      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      toast.error("Erro ao carregar dados do servidor.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

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

  const insumos = useMemo(() => {
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      return cat && isInsumoCategory(cat);
    });
  }, [products, categories]);

  const getTotalByCategory = (categoryId) => {
    return products.filter((p) => p.category_id === categoryId).length;
  };

  // ============================
  // 🔥 FUNÇÕES DE EXCLUSÃO
  // ============================
  const handleDeleteCategory = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Categoria excluída!");
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao excluir. Verifique dependências.");
      }
    } catch (err) {
      toast.error("Erro de conexão.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Deseja realmente excluir este item?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Item excluído!");
        fetchData();
      } else {
        toast.error("Erro ao excluir o item.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
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

      {tab === "itens" && (
        <SubTabsProdutos subTab={subTab} setSubTab={setSubTab} />
      )}

      <div className="products-content">
        {/* SEÇÃO: PRODUTOS */}
        {tab === "itens" && subTab === "produtos" && (
          <>
            <button
              className="btn-primary"
              onClick={() => {
                setModalType("produto");
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
                      setModalType("produto");
                      setSelectedProduct(p);
                      setOpenEditProduct(true);
                    }}
                  >
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>
                      R$ {p.sale_price ? Number(p.sale_price).toFixed(2) : "0.00"}
                    </td>
                    <td>{p.min_stock}</td>
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
        {tab === "itens" && subTab === "insumos" && (
          <>
            <button
              className="btn-primary"
              onClick={() => {
                setModalType("insumo");
                setOpenAddProduct(true);
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
                      setModalType("insumo"); 
                      setSelectedProduct(p);    
                      setOpenEditProduct(true); 
                    }}
                  >
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.unit || "N/A"}</td>
                    <td>{p.min_stock}</td>
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

        {/* SEÇÃO: CATEGORIAS */}
        {tab === "categorias" && (
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
                  <th style={{ textAlign: "right" }}>Ações</th>
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
                    <td>{cat.name}</td>
                    <td>
                      <span className={`status ${cat.is_active ? "active" : "inactive"}`}>
                        {cat.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>{getTotalByCategory(cat.id)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteCategory(cat.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
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

      </div>
    </div>
  );
}