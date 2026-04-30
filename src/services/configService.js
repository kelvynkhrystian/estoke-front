import { api } from '../api/api';

export const getConfig = async () => {
  const res = await api.get('/config');
  return res.data;
};

export const updateConfig = async (data) => {
  const res = await api.put('/config', data);
  return res.data;
};
