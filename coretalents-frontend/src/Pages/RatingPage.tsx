// src/pages/RatingPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

type UserRating = {
  user_id: number;
  username: string;
  xp: number;
};

export default function RatingPage() {
  const [users, setUsers] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rating`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err: any) {
        console.error("Ошибка загрузки рейтинга:", err);
        setError("⚠️ Не удалось загрузить рейтинг");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Загрузка рейтинга...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🏆 Топ-10 пользователей</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {users.length === 0 ? (
        <p className="text-center text-gray-600">Пока нет данных для отображения.</p>
      ) : (
        users.map((user, index) => (
          <Card
            key={user.user_id}
            className="mb-2 p-4 flex justify-between items-center shadow rounded-lg"
          >
            <span className="font-semibold text-lg">
              {index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `${index + 1}.`}{" "}
              {user.username}
            </span>
            <span className="text-sm text-gray-500">XP: {user.xp}</span>
          </Card>
        ))
      )}
    </div>
  );
}
