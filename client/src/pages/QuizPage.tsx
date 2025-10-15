import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Choice = { id: number; text: string };
type Question = {
  id: number;
  prompt: string;
  choices: Choice[];
  correctId: number; 
};

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: `What is the meaning of "Dog"?`,
    choices: [
      { id: 1, text: "mèo" },
      { id: 2, text: "cún" },
      { id: 3, text: "ngựa" },
      { id: 4, text: "chim" },
    ],
    correctId: 2,
  },
  {
    id: 2,
    prompt: `What is the meaning of "Apple"?`,
    choices: [
      { id: 1, text: "quả nho" },
      { id: 2, text: "quả táo" },
      { id: 3, text: "quả chuối" },
      { id: 4, text: "quả lê" },
    ],
    correctId: 2,
  },
];

export default function QuizPage() {
  const [categoryId, setCategoryId] = useState<string>("");
  const [started, setStarted] = useState(false);

  const [idx, setIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const q = MOCK_QUESTIONS[idx];
  const total = MOCK_QUESTIONS.length;

  const progress = useMemo(
    () => Math.round(((idx + 1) / total) * 100),
    [idx, total]
  );

  const handleStart = () => {
    setStarted(true);
    setIdx(0);
    setSelectedId(null);
  };

  const handlePick = (choiceId: number) => {
    if (!started) return;
    setSelectedId(choiceId);
  };

  const prev = () => {
    if (idx > 0) {
      setIdx((i) => i - 1);
      setSelectedId(null);
    }
  };
  const next = () => {
    if (idx < total - 1) {
      setIdx((i) => i + 1);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto h-12 px-4 flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <Link to="/" className="font-semibold">
              VocabApp
            </Link>
            <nav className="hidden md:flex gap-6 text-sm">
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
              <span className="text-blue-600 font-semibold">Quiz</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Vocabulary Quiz</h1>
            <button
              onClick={handleStart}
              className="px-4 h-9 rounded bg-green-500 text-white text-sm hover:bg-green-600"
            >
              Start Quiz
            </button>
          </div>

          {/* Bộ lọc danh mục */}
          <div className="mt-4">
            <select
              disabled={started}
              className="w-265 h-9 border rounded px-3 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="1">Con vật</option>
              <option value="2">Trái cây</option>
            </select>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{started ? `${idx + 1}/${total}` : `0/${total}`}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded transition-all"
                style={{
                  width: started ? `${progress}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* Card câu hỏi */}
          <div className="mt-5 rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] p-5">
            {!started ? (
              <div className="text-center py-14 text-gray-400">
                Click “Start Quiz” to begin
              </div>
            ) : (
              <>
                <p className="text-[15px] font-semibold mb-3">
                  What is the meaning of “{q.prompt.split('"')[1]}”?
                </p>

                <div className="space-y-3">
                  {q.choices.map((c) => {
                    const isPicked = selectedId === c.id;
                    const isCorrect = c.id === q.correctId;
                    // styling: nếu đã chọn , đúng = xanh, sai = đỏ
                    const pickedClass = isPicked
                      ? isCorrect
                        ? "bg-green-100 ring-1 ring-green-300"
                        : "bg-red-100 ring-1 ring-red-300"
                      : "bg-white ring-1 ring-gray-200 hover:bg-gray-50";
                    const textClass = isPicked
                      ? isCorrect
                        ? "text-green-700"
                        : "text-red-700"
                      : "text-gray-800";

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handlePick(c.id)}
                        className={`w-full text-left px-4 h-11 rounded-md transition ${pickedClass}`}
                      >
                        <span className={`text-sm ${textClass}`}>{c.text}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={!started || idx === 0}
              className="px-4 h-9 rounded bg-gray-200 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={next}
              disabled={!started || idx >= total - 1}
              className="px-4 h-9 rounded bg-blue-500 text-white text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Lịch sử quiz */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold mb-2">Quiz History</h2>

            <div className="rounded-md bg-gray-100 text-[12px] tracking-wide text-gray-600 shadow-sm">
              <div className="grid grid-cols-12 px-4 py-2">
                <div className="col-span-4">DATE</div>
                <div className="col-span-4">CATEGORY</div>
                <div className="col-span-4">SCORE</div>
              </div>
            </div>
            <div className="rounded-md mt-2 bg-white px-4 py-4 text-center text-sm text-gray-500">
              No records yet
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 VocabApp. All rights reserved.
        </p>
      </main>
    </div>
  );
}
