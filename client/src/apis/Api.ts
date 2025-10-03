import type { AuthResponse, RegisterPayload, User } from "../types/auth";
import axiosClient from "./axiosClient";

const authApi = {
  async register(body: RegisterPayload): Promise<AuthResponse> {
    // json-server sẽ trả về user vừa tạo (có id)
    const { data } = await axiosClient.post<User>("/users", body);
    // token giả (nếu bạn cần)
    const token = btoa(`${data.id}:${data.email}:${Date.now()}`);
    return { user: data, token };
  },

  // (nếu có login thì để lại; không bắt buộc cho yêu cầu này)
};

export default authApi;
