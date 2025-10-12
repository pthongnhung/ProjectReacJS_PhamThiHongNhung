/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../store";
import type { Category, CategoryPayload } from "../../types/category";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  setPage, // thêm action đổi page từ slice
} from "../../store/slices/categorySlice";

import Modal from "../../components/ui/Modal";
import CategoryForm from "../../components/forms/CategoryForm";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Swal from "sweetalert2";
import { logout } from "../../store/slices/authSlice";

export default function CategoriesPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { items, loading, error, page, limit, total } = useSelector(
    (s: RootState) => s.categories
  );

  const [q, setQ] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [openDelete, setOpenDelete] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  // Fetch categories theo page, limit, q
  useEffect(() => {
    dispatch(
      fetchCategories({ _page: page, _limit: limit, q: q || undefined })
    );
  }, [dispatch, q, page, limit]);

  const totalPages = Math.ceil(total / limit) || 1;

  const onCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const onEdit = (c: Category) => {
    setEditing(c);
    setOpenForm(true);
  };
  const onRemove = (id: number) => setOpenDelete({ open: true, id });

  const submitForm = async (body: CategoryPayload) => {
    if (editing) {
      const res = await dispatch(updateCategory({ id: editing.id, body }));
      if (updateCategory.fulfilled.match(res)) setOpenForm(false);
    } else {
      const res = await dispatch(createCategory(body));
      if (createCategory.fulfilled.match(res)) setOpenForm(false);
    }
  };

  const confirmDelete = async () => {
    if (!openDelete.id) return;
    const res = await dispatch(deleteCategory(openDelete.id));
    if (deleteCategory.fulfilled.match(res)) {
      setOpenDelete({ open: false });
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
        Swal.fire({
          title: "Logout!",
          text: "Your file has been logout.",
          icon: "success",
        });
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
              <Link to="/categories" className="text-blue-600 font-semibold">
                Categories
              </Link>
              <Link to="/vocabs" className="text-gray-600 hover:text-black">
                Vocabulary
              </Link>
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
      <div className="max-w-6xl h-[90vh] mx-auto px-4 py-6 flex flex-col justify-between">
        <div className="rounded-xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between px-6 pt-6">
            <h1 className="text-xl font-bold">Vocabulary Categories</h1>
            <button
              onClick={onCreate}
              className="px-4 py-2 rounded bg-green-500 text-white text-sm hover:bg-green-600"
            >
              Add New Category
            </button>
          </div>

          <div className="px-6 mt-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search categories..."
              className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-gray-500"
            />
          </div>

          <div className="px-6 py-4">
            {/* header */}
            <div className="rounded-md bg-gray-100 text-[12px] tracking-wide text-gray-600 shadow-sm">
              <div className="grid grid-cols-12 px-4 py-2">
                <div className="col-span-4">NAME</div>
                <div className="col-span-6">DESCRIPTION</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>
            </div>

            {/* rows */}
            <div className="rounded-md mt-2 bg-white">
              {items.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No categories yet
                </div>
              ) : (
                items.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-12 px-4 py-3  text-sm"
                  >
                    <div className="col-span-4">{c.name}</div>
                    <div className="col-span-6">{c.description || "-"}</div>
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => onEdit(c)}
                        className="px-3 py-1 rounded text-blue-500 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRemove(c.id)}
                        className="px-3 py-1 rounded text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && <p className="text-red-500 mt-3">{error}</p>}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => dispatch(setPage(page - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => dispatch(setPage(page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 VocabApp. All rights reserved.
        </p>
      </div>

      {/* Modal Add/Edit */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={editing ? "Edit Category" : "Add Category"}
        widthClass="w-[640px]"
      >
        <CategoryForm
          initial={editing}
          onSubmit={submitForm}
          onCancel={() => setOpenForm(false)}
          loading={loading}
        />
      </Modal>

      {/* Modal Delete */}
      <ConfirmModal
        open={openDelete.open}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onCancel={() => setOpenDelete({ open: false })}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  );
}
