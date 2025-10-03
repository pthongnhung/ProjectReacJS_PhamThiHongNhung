import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { registerThunk } from "../../store/slices/authSlice";
import axiosClient from "../../apis/axiosClient";


type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
};

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>();

  const submit = async (v: FormValues) => {
    clearErrors();
    let bad = false;

    if (!v.firstName?.trim()) {
      setError("firstName", { message: "First Name không được để trống" });
      bad = true;
    }
    if (!v.lastName?.trim()) {
      setError("lastName", { message: "Last Name không được để trống" });
      bad = true;
    }
    if (!v.email?.trim()) {
      setError("email", { message: "Email không được để trống" });
      bad = true;
    }
    if (!v.password?.trim()) {
      setError("password", { message: "Mật khẩu không được để trống" });
      bad = true;
    }
    if (!v.confirm?.trim()) {
      setError("confirm", { message: "Mật khẩu xác nhận không được để trống" });
      bad = true;
    }
    if (bad) return;

    const atIndex = v.email.indexOf("@");
    if (atIndex <= 0) {
      setError("email", { message: "Email không hợp lệ" });
      bad = true;
    }
    if ((v.password ?? "").length < 8) {
      setError("password", { message: "Mật khẩu tối thiểu 8 ký tự" });
      bad = true;
    }
    if (v.password !== v.confirm) {
      setError("confirm", {
        message: "Mật khẩu xác nhận phải trùng với Mật khẩu",
      });
      bad = true;
    }
    if (bad) return;

    try {
      const { data } = await axiosClient.get<
        Array<{ id: number; email: string }>
      >("/users", { params: { email: v.email } });
      if (Array.isArray(data) && data.length > 0) {
        setError("email", { message: "Email đã tồn tại" });
        return;
      }
    } catch {
      console.log(error);
      
    }

    const res = await dispatch(
      registerThunk({
        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        email: v.email.trim(),
        password: v.password,
      })
    );

    if (registerThunk.fulfilled.match(res)) onSuccess(); 
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      className="w-[420px] bg-white rounded-lg shadow-md p-6"
    >
      <h1 className="text-center text-xl font-semibold mb-5">Register</h1>

      <label className="block text-sm mb-1">First Name</label>
      <input
        {...register("firstName")}
        type="text"
        className="w-full border border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        placeholder="First Name"
      />
      {errors.firstName && (
        <p className="text-red-500 text-sm mb-2">{errors.firstName.message}</p>
      )}

      <label className="block text-sm mb-1">Last Name</label>
      <input
        {...register("lastName")}
        type="text"
        className="w-full border border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        placeholder="Last Name"
      />
      {errors.lastName && (
        <p className="text-red-500 text-sm mb-2">{errors.lastName.message}</p>
      )}

      <label className="block text-sm mb-1">Email</label>
      <input
        {...register("email")}
        type="text"
        inputMode="email" 
        className="w-full border border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        placeholder="Email"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
      )}

      <label className="block text-sm mb-1">Password</label>
      <input
        {...register("password")}
        type="password"
        className="w-full border border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        placeholder="Password"
      />
      {errors.password && (
        <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
      )}

      <label className="block text-sm mb-1">Confirm Password</label>
      <input
        {...register("confirm")}
        type="password"
        className="w-full border border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        placeholder="Confirm Password"
      />
      {errors.confirm && (
        <p className="text-red-500 text-sm mb-3">{errors.confirm.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-9 rounded bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-70"
      >
        {loading ? "Đang xử lý..." : "Register"}
      </button>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </form>
  );
}
