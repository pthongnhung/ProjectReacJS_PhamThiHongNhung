/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../store";
import type { Vocab, VocabPayload } from "../../types/vocab";
import type { Category } from "../../types/category";

import {
  fetchVocabs,
  createVocab,
  updateVocab,
  deleteVocab,
  setPage,
  setLimit,
  setSearch,
  setCategoryFilter,
} from "../../store/slices/vocabSlice";

import { fetchCategories } from "../../store/slices/categorySlice";

import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import VocabForm from "../../components/forms/VocabForm";
import usePagination from "../../hooks/usePagination";
import Swal from "sweetalert2";
import { logout } from "../../store/slices/authSlice";

export default function VocabsPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { items, loading, error, total, page, limit, q, categoryId } =
    useSelector((s: RootState) => s.vocabs);
  const categories: Category[] = useSelector(
    (s: RootState) => s.categories.items
  );

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Vocab | null>(null);
  const [openDelete, setOpenDelete] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  // fetch categories (để đổ vào dropdown) + fetch vocabs khi filter/pagination đổi
  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchVocabs());
  }, [dispatch, page, limit, q, categoryId]);

  const onCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const onEdit = (v: Vocab) => {
    setEditing(v);
    setOpenForm(true);
  };
  const onRemove = (id: number) => setOpenDelete({ open: true, id });

  const submitForm = async (body: VocabPayload) => {
    if (editing) {
      const res = await dispatch(updateVocab({ id: editing.id, body }));
      if (updateVocab.fulfilled.match(res)) setOpenForm(false);
    } else {
      const res = await dispatch(createVocab(body));
      if (createVocab.fulfilled.match(res)) setOpenForm(false);
    }
    // để luôn chuẩn trang/total, gọi fetch lại
    dispatch(fetchVocabs());
  };

  const confirmDelete = async () => {
    if (!openDelete.id) return;
    const res = await dispatch(deleteVocab(openDelete.id));
    if (deleteVocab.fulfilled.match(res)) {
      setOpenDelete({ open: false });
      dispatch(fetchVocabs());
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  // pagination UI
  const { totalPages, canPrev, canNext, pages } = usePagination(
    total,
    page,
    limit
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar giống các trang khác */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto h-12 px-4 flex items-center justify-between">
          <div className="flex gap-[10px]">
            <Link to="/" className="font-semibold">
              VocabApp
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/dashboard" className="text-gray-600 hover:text-black">
                Dashboard
              </Link>
              <Link to="/categories" className="text-gray-600 hover:text-black">
                Categories
              </Link>
              <span className="text-blue-600 font-semibold">Vocabulary</span>
              <Link to="/flashcards" className="text-gray-600 hover:text-black">
                Flashcards
              </Link>
              <Link to="/quiz" className="text-gray-600 hover:text-black">
                Quiz
              </Link>
            </nav>
          </div>

          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Card */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between px-6 pt-6">
            <h1 className="text-xl font-bold">Vocabulary Words</h1>
            <button
              onClick={onCreate}
              className="px-4 py-2 rounded bg-green-500 text-white text-sm hover:bg-green-600"
            >
              Add New Word
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 mt-4 flex gap-3">
            <select
              className="h-9 border rounded px-3 text-sm"
              value={categoryId === "" ? "" : Number(categoryId)}
              onChange={(e) =>
                dispatch(
                  setCategoryFilter(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                )
              }
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              value={q}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Search vocabulary..."
              className="flex-1 h-9 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-gray-500"
            />

            <select
              className="h-9 border rounded px-2 text-sm"
              value={limit}
              onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
              title="Items per page"
            >
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>

          <div className="px-6 py-4">
            {/* header */}
            <div className="rounded-md bg-gray-100 text-[12px] tracking-wide text-gray-600 shadow-sm">
              <div className="grid grid-cols-12 px-4 py-2">
                <div className="col-span-4">WORD</div>
                <div className="col-span-4">MEANING</div>
                <div className="col-span-2">CATEGORY</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>
            </div>

            {/* rows */}
            <div className="rounded-md mt-2 bg-white">
              {items.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No words found
                </div>
              ) : (
                items.map((v) => {
                  const cat = categories.find((c) => c.id === v.categoryId);
                  return (
                    <div
                      key={v.id}
                      className="grid grid-cols-12 px-4 py-3 text-sm"
                    >
                      <div className="col-span-4">{v.word}</div>
                      <div className="col-span-4">{v.meaning}</div>
                      <div className="col-span-2">{cat?.name ?? "-"}</div>
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => onEdit(v)}
                          className="px-3 py-1 rounded text-blue-500 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onRemove(v.id)}
                          className="px-3 py-1 rounded text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {page}/{totalPages} — Total: {total}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!canPrev}
                  onClick={() => dispatch(setPage(page - 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => dispatch(setPage(p))}
                    className={`px-3 py-1 border rounded ${
                      p === page ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={!canNext}
                  onClick={() => dispatch(setPage(page + 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 mt-3">{error}</p>}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 VocabApp. All rights reserved.
        </p>
      </main>

      {/* Modal Add/Edit */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={editing ? "Edit Word" : "Add New Word"}
        widthClass="w-[640px]"
      >
        <VocabForm
          initial={editing}
          categories={categories}
          onSubmit={submitForm}
          onCancel={() => setOpenForm(false)}
          loading={loading}
        />
      </Modal>

      {/* Modal Delete */}
      <ConfirmModal
        open={openDelete.open}
        title="Delete Word"
        message="Are you sure you want to delete this word?"
        onCancel={() => setOpenDelete({ open: false })}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  );
}
