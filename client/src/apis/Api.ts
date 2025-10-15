import type {
  RegisterPayload,
  LoginPayload,
  User,
} from "../types/auth";
import axiosClient from "./axiosClient";

const authApi = {
  async register(body: RegisterPayload): Promise<{ user: User }> {
    const { data } = await axiosClient.post<User>("/users", body);
    return { user: data };
  },

  async login(body: LoginPayload): Promise<{ user: User }> {
    const { data } = await axiosClient.get<User[]>("/users", {
      params: { email: body.email },
    });
    const user = data?.[0];
    if (!user) throw new Error("Email không tồn tại");
    if (user.password !== body.password) throw new Error("Sai mật khẩu");
    return { user };
  },
};

export default authApi;
