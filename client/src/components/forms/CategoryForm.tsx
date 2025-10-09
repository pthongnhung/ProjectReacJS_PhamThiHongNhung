/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Category, CategoryPayload } from "../../types/category";
import categoryApi from "../../apis/categoryApi"; // cần import api để check trùng

interface Props {
  initial?: Category | null;
  onSubmit: (body: CategoryPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CategoryPayload>();

  useEffect(() => {
    if (initial) {
      setValue("name", initial.name);
      setValue("description", initial.description || "");
    } else {
      reset({ name: "", description: "" });
    }
  }, [initial, reset, setValue]);

  const submit = async (v: CategoryPayload) => {
    // check rỗng
    if (!v.name?.trim()) {
      setError("name", { type: "manual", message: "Tên không được để trống" });
      return;
    }
    if (!v.description?.trim()) {
      setError("description", {
        type: "manual",
        message: "Mô tả không được để trống",
      });
      return;
    }

    // check trùng
    try {
      const res = await categoryApi.getAll({ q: v.name });
      const exists = res.data.find(
        (c: any) =>
          c.name.toLowerCase() === v.name.toLowerCase() && c.id !== initial?.id // khi edit thì bỏ qua chính nó
      );
      if (exists) {
        setError("name", {
          type: "manual",
          message: "Tên danh mục đã tồn tại",
        });
        return;
      }
    } catch (err) {
      console.error("Validate error:", err);
    }

    // không lỗi thì submit
    onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <label className="block text-sm font-medium mb-1">Name</label>
      <input
        {...register("name")}
        className="w-full h-10 border rounded px-3 mb-1 outline-none focus:ring-2 focus:ring-blue-200 focus:border-gray-500"
        placeholder="Category name"
      />
      {errors.name && (
        <p className="text-sm text-red-500 mb-2">{errors.name.message}</p>
      )}

      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea
        {...register("description")}
        rows={6}
        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 focus:border-gray-500"
        placeholder="Description"
      />
      {errors.description && (
        <p className="text-sm text-red-500 mb-2">
          {errors.description.message}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 h-9 rounded bg-gray-500/70 text-white hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 h-9 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
