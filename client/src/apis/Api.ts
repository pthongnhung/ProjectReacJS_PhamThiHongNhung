import type {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  User,
} from "../types/auth";
import axiosClient from "./axiosClient";

const authApi = {
  async register(body: RegisterPayload): Promise<AuthResponse> {
    const { data } = await axiosClient.post<User>("/users", body);
    const token = btoa(`${data.id}:${data.email}:${Date.now()}`);
    return { user: data, token };
  },

  async login(body: LoginPayload): Promise<AuthResponse> {
    const { data } = await axiosClient.get<User[]>("/users", {
      params: { email: body.email },
    });
    const user = data?.[0];
    if (!user) throw new Error("Email không tồn tại");
    if (user.password !== body.password) throw new Error("Sai mật khẩu");
    const token = btoa(`${user.id}:${user.email}:${Date.now()}`);
    return { user, token };
  },
};

export default authApi;
