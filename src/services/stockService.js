import { api } from '../api/api';

// 🔹 ESTOQUE (já usa store do usuário logado)
// export const getStock = (type) =>
//   api.get(`/stock?type=${type}`);

export const getStock = (type, storeId = null) => {
  const params = new URLSearchParams();

  if (type) params.append('type', type);
  if (storeId) params.append('store_id', storeId);

  return api.get(`/stock?${params.toString()}`);
};

// 🔹 MOVIMENTAÇÕES
export const getMovements = () => api.get('/stock/movements');

// 🔹 ENTRADA / SAÍDA / AJUSTE
export const addMovement = (data) => api.post('/stock/movements', data);

// 🔥 TRANSFERÊNCIA ENTRE LOJAS
export const transferStock = (data) => api.post('/stock/transfer', data);
