import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CategoriesPage from "./pages/management/CategoriesPage";
import VocabsPage from "./pages/management/VocabsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute redirectTo="/login">
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/categories",
    element: <CategoriesPage />,
  },
  {
    path: "/vocabs",
    element: <VocabsPage />,
  },
  {
    path: "/flashcards",
    element: <FlashcardsPage />,
  },
  {
    path: "/quiz", 
    element:<QuizPage />
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
