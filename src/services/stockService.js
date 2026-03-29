import { api } from "../api/api";

// 🔹 ESTOQUE (já usa store do usuário logado)
export const getStock = (type) =>
  api.get(`/stock?type=${type}`);

// 🔹 MOVIMENTAÇÕES
export const getMovements = () =>
  api.get("/stock/movements");

// 🔹 ENTRADA / SAÍDA / AJUSTE
export const addMovement = (data) =>
  api.post("/stock/moviment", data);

// 🔥 TRANSFERÊNCIA ENTRE LOJAS
export const transferStock = (data) =>
  api.post("/stock/transfer", data);