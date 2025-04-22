import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardTests from "@/components/DashboardTests";
import DashboardResults from "@/components/DashboardResults";
import DashboardHero from "@/components/DashboardHero";
import DashboardMentor from "@/components/DashboardMentor";
import DashboardProfessions from "@/components/DashboardProfessions";
import DashboardRanking from "@/components/DashboardRanking";
import DashboardHabits from "@/components/DashboardHabits";
import DashboardThinking from "@/components/DashboardThinking";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("tests");
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Загрузка данных пользователя
    axios.get(`${import.meta.env.VITE_API_URL}/users/me`)
      .then(res => setUser(res.data))
      .catch(() => {
        handleLogout(); // 🛡 Автоматический выход если токен неверный
      });

    // Загрузка результатов тестов
    axios.get(`${import.meta.env.VITE_API_URL}/tests/my-results`)
      .then(res => setTestResults(res.data))
      .catch(err => console.error("Ошибка загрузки результатов тестов", err));
  }, [navigate]);

  // 📋 Функция выхода
  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаление токена
    delete axios.defaults.headers.common["Authorization"]; // Очистка заголовков
    setUser(null); // Очистить пользователя в состоянии
    navigate("/login"); // Перенаправление на страницу входа
  };

  if (!user) return null; // Пока нет пользователя — ничего не рендерим

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Добро пожаловать, {user.name}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          🚪 Выйти
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setCurrentTab("tests")} className={tabButtonClass(currentTab === "tests")}>
          Тесты
        </button>
        <button onClick={() => setCurrentTab("results")} className={tabButtonClass(currentTab === "results")}>
          Результаты
        </button>
        <button onClick={() => setCurrentTab("hero")} className={tabButtonClass(currentTab === "hero")}>
          Герой
        </button>
        <button onClick={() => setCurrentTab("mentor")} className={tabButtonClass(currentTab === "mentor")}>
          Наставник
        </button>
        <button onClick={() => setCurrentTab("professions")} className={tabButtonClass(currentTab === "professions")}>
          Профессии
        </button>
        <button onClick={() => setCurrentTab("ranking")} className={tabButtonClass(currentTab === "ranking")}>
          Рейтинг
        </button>
        <button onClick={() => setCurrentTab("habits")} className={tabButtonClass(currentTab === "habits")}>
          Привычки
        </button>
        <button onClick={() => setCurrentTab("thinking")} className={tabButtonClass(currentTab === "thinking")}>
          Мышление
        </button>
      </div>

      {/* Контент вкладок */}
      {currentTab === "tests" && <DashboardTests />}
      {currentTab === "results" && <DashboardResults results={testResults} />}
      {currentTab === "hero" && <DashboardHero />}
      {currentTab === "mentor" && <DashboardMentor />}
      {currentTab === "professions" && <DashboardProfessions />}
      {currentTab === "ranking" && <DashboardRanking />}
      {currentTab === "habits" && <DashboardHabits />}
      {currentTab === "thinking" && <DashboardThinking />}
    </div>
  );
}

// 📋 Функция для стилей активной/неактивной вкладки
function tabButtonClass(isActive: boolean) {
  return `px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} hover:bg-blue-600 transition duration-200`;
}
