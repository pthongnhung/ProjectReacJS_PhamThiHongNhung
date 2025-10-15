/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import type { Category } from "../types/category";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchVocabs, markLearned, setCategoryFilter, setLimit, setPage } from "../store/slices/vocabSlice";
import type { Vocab } from "../types/vocab";
import usePagination from "../hooks/usePagination";
import { logout } from "../store/slices/authSlice";
import Swal from "sweetalert2";



export default function FlashcardsPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { items, loading, total, page, limit, categoryId } = useSelector(
    (s: RootState) => s.vocabs
  );
  const categories: Category[] = useSelector(
    (s: RootState) => s.categories.items
  );

  // tải categories 1 lần
  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch]);

  // tải vocabs khi đổi trang/limit/category
  useEffect(() => {
    dispatch(fetchVocabs());
  }, [dispatch, page, limit, categoryId]);

  // index của thẻ đang xem trong mảng items hiện tại
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // reset vị trí khi danh sách trang thay đổi
  useEffect(() => {
    setCardIdx(0);
    setFlipped(false);
  }, [items]);

  const current: Vocab | undefined = items[cardIdx];
  const learnedCount = useMemo(
    () => items.filter((x) => x.isLearned).length,
    [items]
  );

  const { totalPages, canPrev, canNext, pages } = usePagination(
    total,
    page,
    limit
  );

  const toggleLearned = async () => {
    if (!current) return;
    await dispatch(
      markLearned({ id: current.id, isLearned: !current.isLearned })
    );

  };

  const prevCard = () => {
    if (cardIdx > 0) {
      setCardIdx((i) => i - 1);
      setFlipped(false);
    }
  };
  const nextCard = () => {
    if (cardIdx < items.length - 1) {
      setCardIdx((i) => i + 1);
      setFlipped(false);
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
      {/* Navbar */}
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
              <Link to="/vocabs" className="text-gray-600 hover:text-black">
                Vocabulary
              </Link>
              <span className="text-blue-600 font-semibold">Flashcards</span>
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

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] p-6">
          <h1 className="text-xl font-bold mb-4">Flashcard Learning</h1>

          {/* Filter + limit */}
          <div className="flex flex-col gap-3 mb-4">
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

            
          </div>

          {/* CARD */}
          <div className="flex justify-center mb-6">
            <div className="perspective-[1200px]">
              <div
                onClick={() => setFlipped((f) => !f)}
                className={[
                  "relative select-none cursor-pointer",
                  "w-[560px] h-[260px]", 
                  "rounded-2xl bg-white",
                  "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]", 
                  "ring-1 ring-black/5", 
                  "transition-transform duration-500",
                ].join(" ")}
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 flex items-center justify-center px-8 text-[22px] font-semibold text-gray-800"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {current ? (
                    current.word
                  ) : (
                    <span className="text-gray-400">No words available</span>
                  )}
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 flex items-center justify-center px-8 text-[22px] font-semibold text-gray-800"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {current ? (
                    current.meaning
                  ) : (
                    <span className="text-gray-400">No words available</span>
                  )}
                </div>

                
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <button
              onClick={prevCard}
              disabled={!current || cardIdx === 0}
              className="px-4 h-9 rounded bg-blue-500 text-white text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={toggleLearned}
              disabled={!current}
              className={`px-4 h-9 rounded text-white text-sm ${
                current?.isLearned ? "bg-gray-500" : "bg-green-500"
              }`}
            >
              {current?.isLearned ? "Unmark" : "Mark as Learned"}
            </button>
            <button
              onClick={nextCard}
              disabled={!current || cardIdx >= items.length - 1}
              className="px-4 h-9 rounded bg-blue-500 text-white text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Progress */}
          <div className="mx-auto max-w-[520px]">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {learnedCount}/{items.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-500 rounded"
                style={{
                  width:
                    items.length === 0
                      ? "0%"
                      : `${(learnedCount / items.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="mt-6">
            <div className="rounded-md bg-gray-100 text-[12px] tracking-wide text-gray-600 shadow-sm">
              <div className="grid grid-cols-12 px-4 py-2">
                <div className="col-span-4">WORD</div>
                <div className="col-span-6">MEANING</div>
                <div className="col-span-2">STATUS</div>
              </div>
            </div>

            <div className="rounded-md mt-2 bg-white">
              {items.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No words
                </div>
              ) : (
                items.map((v) => (
                  <div
                    key={v.id}
                    className="grid grid-cols-12 px-4 py-3 text-sm"
                  >
                    <div className="col-span-4">{v.word}</div>
                    <div className="col-span-6">{v.meaning}</div>
                    <div className="col-span-2">
                      {v.isLearned ? "Learned" : "New"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
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

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 VocabApp. All rights reserved.
        </p>
      </main>
    </div>
  );
}
