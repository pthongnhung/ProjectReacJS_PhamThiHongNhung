import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { loginThunk } from "../../store/slices/authSlice";

type FormValues = { email: string; password: string };

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
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

    if (!v.email?.trim()) {
      setError("email", { message: "Email không được để trống" });
      bad = true;
    }
    if (!v.password?.trim()) {
      setError("password", { message: "Mật khẩu không được để trống" });
      bad = true;
    }
    if (bad) return;

    if (v.email.indexOf("@") <= 0) {
      setError("email", { message: "Email không hợp lệ" });
      return;
    }

    const res = await dispatch(
      loginThunk({ email: v.email.trim(), password: v.password })
    );
    if (loginThunk.fulfilled.match(res)) onSuccess();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      className="w-[420px] bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <h2 className="text-center text-xl font-semibold">Login</h2>

      <div>
        <input
          {...register("email")}
          type="text"
          inputMode="email"
          placeholder="Email"
          className="w-full border rounded px-3 h-9  border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 h-9  border-gray-400 rounded px-3 h-9 mb-2 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-9 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-70 mt-[10px]"
      >
        {loading ? "Đang xử lý..." : "Login"}
      </button>
    </form>
  );
}
