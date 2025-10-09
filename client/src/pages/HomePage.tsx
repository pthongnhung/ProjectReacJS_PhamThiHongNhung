import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import Swal from "sweetalert2";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
              <Link to="/categories" className="text-gray-600 hover:text-black">
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
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center py-20">
          <h1 className="text-2xl font-bold">Welcome to VocabApp</h1>
          <p className="text-gray-600 mt-3">
            Learn and practice vocabulary with flashcards and quizzes
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to="/categories"
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-green-500 text-white text-sm hover:bg-green-600"
            >
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-16 pb-6">
          © 2024 VocabApp. All rights reserved.
        </p>
      </main>
    </div>
  );
}
