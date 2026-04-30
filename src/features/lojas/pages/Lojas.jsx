import { useState } from 'react';
// import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import HeaderLojas from '../components/HeaderLojas';
import AddLoja from '../modais/AddLoja';
import EditLoja from '../modais/EditLoja';
import { getStores, deleteStore } from '../services/storeService';

import './lojas.css';

export default function Lojas() {
  const [stores, setStores] = useState([]);

  // 🔥 CONTROLES
  const [openAddStore, setOpenAddStore] = useState(false);
  const [openEditStore, setOpenEditStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // 🔄 LOAD
  const loadStores = async () => {
    try {
      const res = await getStores(); // ✅ correto (sem .res)
      setStores(res.data);
      console.log(stores);
    } catch (err) {
      console.error('Erro ao carregar lojas', err);
    }
  };

  // useEffect(() => {
  //   loadStores();
  // }, []);

  // 🗑️ DELETE
  const handleDeleteStore = async (id) => {
    if (!confirm('Deseja excluir essa loja?')) return;

    try {
      await deleteStore(id);
      loadStores();
    } catch (err) {
      console.error('Erro ao deletar loja', err);
    }
  };

  return (
    <div className="lojas-page">
      <HeaderLojas />

      <div className="lojas-content">
        <button className="btn-primary" onClick={() => setOpenAddStore(true)}>
          + Nova Loja
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Usuários</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>
                  Nenhuma loja encontrada
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr
                  key={store.id}
                  onDoubleClick={() => {
                    setSelectedStore(store);
                    setOpenEditStore(true);
                  }}
                >
                  <td>{store.id}</td>

                  <td>{store.name}</td>

                  <td>
                    <span
                      className={`status ${
                        store.is_active ? 'active' : 'inactive'
                      }`}
                    >
                      {store.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td>{store.total_users ?? 0}</td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 evita abrir edição
                        handleDeleteStore(store.id);
                      }}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ➕ MODAL ADD */}
      <AddLoja
        open={openAddStore}
        onClose={() => setOpenAddStore(false)}
        onRefresh={loadStores}
      />

      {/* ✏️ MODAL EDIT */}
      <EditLoja
        open={openEditStore}
        onClose={() => {
          setOpenEditStore(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
        onRefresh={loadStores}
      />
    </div>
  );
}
