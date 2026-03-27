import { useState, useEffect, useMemo } from "react";
import "./produtos.css";
import { Trash2 } from "lucide-react"; // Adicione este ícone
import toast from "react-hot-toast"; // Para avisar que excluiu


import HeaderProdutos from "../../components/produtos/HeaderProdutos";
import TabsProdutos from "../../components/produtos/TabsProdutos";
import SubTabsProdutos from "../../components/produtos/SubTabsProdutos";

// modais
import AddProduct from "./modais/addProduct";
import EditProduct from "./modais/editProduct";
import AddCategorie from "./modais/addCategorie";
import EditCategorie from "./modais/editCategorie";


// 🔥 REGRA CENTRAL
const isInsumoCategory = (category) => {
  return category.name.toLowerCase().includes("insumo");
};

export default function Produtos() {
  const [tab, setTab] = useState("itens");
  const [subTab, setSubTab] = useState("produtos");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ============================
  // 🔥 FETCH REAL
  // ============================
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    

    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_URL}/categories`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/products`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // 🔥 valida resposta
        if (!catRes.ok || !prodRes.ok) {
          throw new Error("Erro ao buscar dados da API");
        }

        const cats = await catRes.json();
        const prods = await prodRes.json();

        // 🔥 garante array (evita crash no filter)
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

  // ============================
  // 🔥 FILTROS
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
  // LOADING
  // ============================

  if (loading) {
    return <div className="products-page">Carregando...</div>;
  }

  // ============================
  // outros
  // ============================

  const handleDeleteCategory = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Categoria excluída com sucesso!");
        // Atualiza a lista localmente removendo a categoria deletada
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao excluir categoria.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão ao excluir.");
    }
  };






  return (
    <div className="products-page">

      <HeaderProdutos />

      <TabsProdutos tab={tab} setTab={setTab} />

      {tab === "itens" && (
        <SubTabsProdutos subTab={subTab} setSubTab={setSubTab} />
      )}

      <div className="products-content">

        {/* PRODUTOS */}
        {tab === "itens" && subTab === "produtos" && (
          <>
            <button
              className="btn-primary"
              onClick={() => setOpenAddProduct(true)}
            >
              + Novo Produto
            </button>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque mínimo</th>
                </tr>
              </thead>

              <tbody>
                {produtos.map((p) => (
                  <tr
                    key={p.id}
                    onDoubleClick={() => {
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
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* INSUMOS */}
        {tab === "itens" && subTab === "insumos" && (
          <>
            <button
              className="btn-primary"
              onClick={() => setOpenAddProduct(true)}
            >
              + Novo Insumo
            </button>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Unidade</th>
                  <th>Estoque mínimo</th>
                </tr>
              </thead>

              <tbody>
                {insumos.map((p) => (
                  <tr
                    key={p.id}
                    onDoubleClick={() => {
                      setSelectedProduct({ ...p, type: "insumo" });
                      setOpenEditProduct(true);
                    }}
                  >
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.unit}</td>
                    <td>{p.min_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* CATEGORIAS */}
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
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>
                        <span className={`status ${cat.is_active ? "active" : "inactive"}`}>
                          {cat.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td>{getTotalByCategory(cat.id)}</td>
                      {/* Coluna com o Botão de Excluir */}
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

        {/* MODAIS PRODUTO */}
        <AddProduct
          open={openAddProduct}
          onClose={() => setOpenAddProduct(false)}
          categories={categories}
        />

        <EditProduct
          open={openEditProduct}
          onClose={() => setOpenEditProduct(false)}
          product={selectedProduct}
          categories={categories}
        />

        {/* MODAIS CATEGORIA */}
        <AddCategorie
          open={openAddCategory}
          onClose={() => setOpenAddCategory(false)}
          onRefresh={fetchData}
        />

        <EditCategorie
          open={openEditCategory}
          onClose={() => setOpenEditCategory(false)}
          category={selectedCategory}
          onRefresh={fetchData}
        />

      </div>
    </div>
  );
}