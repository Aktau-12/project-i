import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddHabitModal from "@/components/AddHabitModal";
import HabitProgress from "@/components/HabitProgress";

interface Habit {
  id: number;
  title: string;
  image_url?: string;
  days: number[];
  done_today: boolean;
  streak: number;
  week_log: boolean[];
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/habits/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке привычек", err);
    }
  };

  const markAsDone = async (habitId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/habits/my/${habitId}/check`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHabits();
    } catch (err) {
      console.error("Ошибка при отметке привычки", err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🧠 Мои привычки</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-blue-600 hover:underline"
        >
          🔙 Назад в меню
        </button>
      </div>

      <div className="mb-10 bg-[#f8f4ec] rounded-2xl p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">🔁 Цикл формирования привычки</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/habit-model.jpeg"
            alt="Цикл привычки"
            className="w-full md:w-1/2 max-h-[320px] object-contain rounded-xl"
          />
          <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
            <li>1️⃣ <b>Напоминание</b>: триггер, запускающий привычку.</li>
            <li>2️⃣ <b>Действие</b>: выполнение привычки.</li>
            <li>3️⃣ <b>Награда</b>: XP, чувство победы, рост.</li>
          </ul>
        </div>
      </div>

      <div className="text-right mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
        >
          ➕ Добавить привычку
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {habits.map((habit: Habit) => (
          <div
            key={habit.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <img
              src={habit.image_url || "/default-habit.jpg"}
              alt={habit.title}
              className="w-full h-36 object-cover rounded-lg mb-3"
            />
            <h4 className="font-semibold text-lg">{habit.title}</h4>
            <p className="text-sm text-gray-600 mt-1">
              🔥 Счётчик: <b>{habit.streak}</b> дней подряд
            </p>

            <HabitProgress weekLog={habit.week_log || []} />

            <button
              onClick={() => markAsDone(habit.id)}
              disabled={habit.done_today}
              className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition ${
                habit.done_today
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {habit.done_today ? "✅ Сегодня выполнено" : "✔ Сделано сегодня"}
            </button>
          </div>
        ))}
      </div>

      <AddHabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={fetchHabits}
      />
    </div>
  );
};

export default HabitTracker;
