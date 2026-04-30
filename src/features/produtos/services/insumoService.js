import { api } from '../../../api/api';

// LISTAR
export const getInsumos = () => api.get('/insumos');

// CRIAR
export const createInsumo = (data) => api.post('/insumos', data);

// ATUALIZAR
export const updateInsumo = (id, data) => api.put(`/insumos/${id}`, data);

// DELETAR
export const deleteInsumo = (id) => api.delete(`/insumos/${id}`);
