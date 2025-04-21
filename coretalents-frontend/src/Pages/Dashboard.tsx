import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeroPath from "../components/HeroPath";
import Ranking from "../components/Ranking";
import HeroProfessions from "../components/HeroProfessions";
import HabitTracker from "./HabitTracker";
import ThinkingAlgorithm from "../components/ThinkingAlgorithm";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [mbtiType, setMbtiType] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [tab, setTab] = useState("menu");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Устанавливаем токен для axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Получаем данные пользователя
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/me`)
      .then((res) => {
        setEmail(res.data.email);
        setMbtiType(res.data.mbti_type || null);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });

    // Получаем результаты тестов
    axios
      .get(`${import.meta.env.VITE_API_URL}/tests/my-results`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const tabs = [
    { key: "tests", label: "🧠 Мои тесты" },
    { key: "results", label: "📊 Результаты" },
    { key: "hero", label: "🛤 Путь героя" },
    { key: "mentor", label: "🤖 AI-наставник" },
    { key: "professions", label: "🧭 Профессии" },
    { key: "ranking", label: "🏆 Рейтинг" },
    { key: "habits", label: "💡 Привычки" },
    { key: "thinking", label: "🧠 Алгоритм мышления" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">📊 Добро пожаловать в Проект-Я</h1>
      {email && (
        <p className="text-center text-gray-600">
          Вы вошли как <strong>{email}</strong>
        </p>
      )}

      {tab === "menu" && (
        <div className="flex flex-wrap justify-center gap-3 border-b pb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === "tests" && (
        <div className="space-y-4">
          <button onClick={() => navigate("/coretalents")} className="btn-primary">
            CoreTalents
          </button>
          <button onClick={() => navigate("/bigfive")} className="btn-primary">
            Big Five
          </button>
          <button onClick={() => navigate("/mbti")} className="btn-primary">
            MBTI
          </button>
          <button onClick={() => setTab("menu")} className="btn-outline">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "results" && (
        <div className="space-y-4">
          {mbtiType && (
            <div className="flex items-center justify-center gap-4">
              <img
                src={`/mbti-avatars/${mbtiType}.png`}
                alt={mbtiType}
                className="w-12 h-12 rounded-full border"
              />
              <p className="text-blue-700 font-semibold">🧬 Ваш MBTI тип: {mbtiType}</p>
            </div>
          )}
          <h3 className="font-semibold">📜 История прохождения:</h3>
          {results.map((res, idx) => (
            <div key={idx} className="bg-gray-100 rounded p-4">
              <p className="text-sm font-medium">
                🧪 {res.test_name} — {new Date(res.completed_at).toLocaleString()}
              </p>
              {res.summary && <p className="text-sm text-gray-700 mt-1">{res.summary}</p>}
            </div>
          ))}
          <button onClick={() => setTab("menu")} className="btn-outline">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "hero" && (
        <div className="space-y-4">
          <HeroPath />
          <button onClick={() => setTab("menu")} className="btn-outline">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "mentor" && (
        <div className="space-y-2 text-sm">
          <p>🎓 Вот персональные рекомендации:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Записывай идеи каждый день.</li>
            <li>Сфокусируйся на одном проекте хотя бы на неделю.</li>
            <li>Сделай первые 3 шага — это заложит фундамент.</li>
          </ul>
          <button onClick={() => setTab("menu")} className="btn-outline">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "professions" && (
        <div>
          <HeroProfessions />
          <button onClick={() => setTab("menu")} className="btn-outline mt-4">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "ranking" && (
        <div>
          <Ranking />
          <button onClick={() => setTab("menu")} className="btn-outline mt-4">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "habits" && (
        <div>
          <HabitTracker />
          <button onClick={() => setTab("menu")} className="btn-outline mt-4">
            🔙 Назад в меню
          </button>
        </div>
      )}

      {tab === "thinking" && (
        <div>
          <ThinkingAlgorithm />
          <button onClick={() => setTab("menu")} className="btn-outline mt-4">
            🔙 Назад в меню
          </button>
        </div>
      )}

      <div className="text-center pt-8">
        <button onClick={() => navigate("/login")} className="bg-red-500 text-white px-4 py-2 rounded">
          🚪 Выйти
        </button>
      </div>
    </div>
  );
}
