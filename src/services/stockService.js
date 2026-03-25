import { api } from "../api/api";

export const getStock = () => api.get("/stock");
export const addMovement = (data) => api.post("/stock/movements", data);