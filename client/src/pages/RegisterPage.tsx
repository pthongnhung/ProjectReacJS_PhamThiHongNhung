import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto h-12 px-4 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            VocabApp
          </Link>
          <nav className="flex gap-2">
            <Link
              to="/login"
              className="px-3 py-1 rounded text-white text-sm bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded text-white text-sm bg-green-500 hover:bg-green-600"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex justify-center pt-16">
        <RegisterForm onSuccess={() => navigate("/login")} />
      </main>
    </div>
  );
}
