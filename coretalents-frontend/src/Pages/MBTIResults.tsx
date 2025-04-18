
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface MBTIResult {
  type_code: string;
  description: string;
  extended_description?: string;
  details?: Record<string, number>;
}

const MBTIResults = () => {
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await axios.get<MBTIResult>(
          "http://localhost:8000/mbti/me/result",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("🎯 Получен MBTI результат:", res.data);
        setResult(res.data);
      } catch (error: any) {
        console.error("❗ Ошибка загрузки результатов MBTI", error);
        if (error.response?.status === 404) {
          alert("❗ Вы ещё не проходили MBTI тест.");
          navigate("/mbti");
        } else {
          alert("Произошла ошибка при загрузке данных. Попробуйте позже.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">⏳ Загрузка...</div>;
  }

  if (!result) {
    return (
      <div className="text-center mt-10 text-red-600">
        ⚠️ Результаты MBTI не найдены.
      </div>
    );
  }

  const avatarUrl = `/mbti-avatars/${result.type_code}.png`;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 border rounded-xl shadow text-center space-y-6 bg-white">
      <h2 className="text-2xl font-bold">🎉 Ваш результат MBTI</h2>

      <div className="flex justify-center">
        <img
          src={avatarUrl}
          onError={(e) => (e.currentTarget.src = "/mbti-avatars/default.png")}
          alt={result.type_code}
          className="w-40 h-40 object-contain mb-2"
        />
      </div>

      <h3 className="text-xl font-semibold">
        Ваш тип:{" "}
        <span className="text-blue-600 text-3xl font-bold">
          {result.type_code}
        </span>{" "}
        — {result.description}
      </h3>

      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
        {result.description}
      </p>

      {result.extended_description && (
        <div className="mt-6 text-left border-t pt-4">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">📖 Подробнее о вас:</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.extended_description}
          </p>
        </div>
      )}

      {result.details && (
        <div className="text-left bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
          <h4 className="font-semibold mb-2">🧮 Баллы по шкалам:</h4>
          <ul className="grid grid-cols-2 gap-2">
            {Object.entries(result.details as Record<string, number>).map(([trait, value]) => (
              <li key={trait}>
                <strong>{trait}</strong>: {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
      >
        🔙 Выйти в меню
      </button>
    </div>
  );
};

export default MBTIResults;
