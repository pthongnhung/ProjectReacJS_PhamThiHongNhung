import React from "react";
import { useForm } from "react-hook-form";
import type { Vocab, VocabPayload } from "../../types/vocab";
import type { Category } from "../../types/category";

type Props = {
  initial?: Vocab | null;
  categories: Category[];
  loading?: boolean;
  onSubmit: (body: VocabPayload) => void;
  onCancel: () => void;
};

export default function VocabForm({
  initial,
  categories,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VocabPayload>({
    defaultValues: initial
      ? {
          word: initial.word,
          meaning: initial.meaning,
          categoryId: initial.categoryId,
        }
      : { word: "", meaning: "", categoryId: categories[0]?.id ?? 0 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm mb-1">Word</label>
        <input
          className="w-full border rounded px-3 h-9 border-gray-400"
          {...register("word")}
          placeholder="Word"
        />
        {errors.word && (
          <p className="text-sm text-red-500 mt-1">{errors.word.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1 ">Meaning</label>
        <textarea
          className="w-full border rounded px-3 h-9  border-gray-400"
          {...register("meaning")}
          placeholder="Meaning"
        />
        {errors.meaning && (
          <p className="text-sm text-red-500 mt-1">{errors.meaning.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Category</label>
        <select
          className="w-full border rounded px-3 h-9  border-gray-400"
          {...register("categoryId", { valueAsNumber: true })}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
