import { api } from "../api/api";

export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);