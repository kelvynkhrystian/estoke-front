import { api } from "../api/api";

export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => 
  api.put(`/categories/${id}`, data);