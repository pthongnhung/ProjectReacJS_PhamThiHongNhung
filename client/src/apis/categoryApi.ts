import axiosClient from "./axiosClient";
import type {
  Category,
  CategoryPayload,
  CategoryQuery,
} from "../types/category";

const categoryApi = {
  // Lấy danh sách có phân trang + tổng số
  async getAll(
    params: CategoryQuery = {}
  ): Promise<{ data: Category[]; total: number }> {
    const res = await axiosClient.get<Category[]>("/categories", {
      params,
    });
    const total = Number(res.headers["x-total-count"] || 0); // lấy tổng số từ header json-server
    return {
      data: res.data,
      total
    };
  },

  async create(body: CategoryPayload): Promise<Category> {
    const { data } = await axiosClient.post<Category>("/categories", body);
    return data;
  },

  async update(id: number, body: CategoryPayload): Promise<Category> {
    const { data } = await axiosClient.put<Category>(`/categories/${id}`, body);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/categories/${id}`);
  },
};

export default categoryApi;
