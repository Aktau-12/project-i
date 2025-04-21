import { useState, useEffect } from "react";
import { getHeroArchetype } from "../utils/getHeroArchetype";
import stepsData from "../data/hero_steps.json";
import axios from "axios";
import HeroCoach from "./HeroCoach";

export default function HeroPath() {
  const [archetype, setArchetype] = useState<any>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const userProfile = {
    mbti: "ENFP",
    bigfive: {
      O: 80,
      C: 55,
      E: 65,
      A: 60,
      N: 30,
    },
    coretalents: ["Визионер", "Идеатор", "Мотиватор"],
  };

  const heroPathStages = [
    "🪞 Пробуждение",
    "🚶 Первые шаги",
    "🧠 Внутренний рост",
    "🔥 Испытания",
    "🏆 Раскрытие потенциала",
  ];

  const currentStage = 1;
  const stageData = stepsData.find((s) => s.stage === currentStage);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/hero/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const completedSteps: string[] = res.data;
        const progressMap: Record<string, boolean> = {};
        completedSteps.forEach((id) => {
          progressMap[id] = true;
        });
        setCheckedSteps(progressMap);
      } catch (err) {
        console.error("❌ Ошибка загрузки прогресса:", err);
      } finally {
        setLoading(false);
      }
    };

    const result = getHeroArchetype(userProfile);
    setArchetype(result);
    fetchProgress();
  }, []);

  const handleStepToggle = async (stepId: string) => {
    const updated = !checkedSteps[stepId];
    setCheckedSteps((prev) => ({ ...prev, [stepId]: updated }));

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/hero/progress`,
        { step_id: stepId, completed: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("❌ Ошибка при обновлении шага:", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Загрузка пути героя...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center">🛄 Путь героя</h2>

      {archetype && (
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-purple-600">
            🧬 Твой архетип: {archetype.name}
          </h3>
          <p className="text-gray-700">{archetype.description}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold">🌱 Этапы твоего пути:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {heroPathStages.map((stage, index) => (
            <div
              key={index}
              className={`border rounded-xl p-4 transition shadow-sm ${
                index + 1 === currentStage
                  ? "bg-purple-100 border-purple-400"
                  : "bg-gray-100 border-gray-200 opacity-70"
              }`}
            >
              <div className="text-lg font-bold mb-1">{stage}</div>
              <p className="text-sm text-gray-600">
                {index === 0
                  ? "Начни путь с самопознания и анализа своих сильных сторон."
                  : index === 1
                  ? "Установи первую цель и начни движение."
                  : index === 2
                  ? "Развивай привычки, фиксируй успехи в дневнике."
                  : index === 3
                  ? "Проходи челленджи, преодолевай страхи, анализируй."
                  : "Ты готов стать наставником или лидером для других."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {stageData && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-2">
            ✅ Задачи на этапе «{stageData.title}»
          </h4>
          <ul className="space-y-3">
            {stageData.steps.map((step) => (
              <li
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  checkedSteps[step.id]
                    ? "bg-green-100 border-green-400"
                    : "bg-white border-gray-300"
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedSteps[step.id] || false}
                    onChange={() => handleStepToggle(step.id)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm">{step.text}</span>
                </label>
                <span className="text-xs text-gray-500">🎯 {step.points} XP</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <HeroCoach
        archetype={archetype}
        bigfive={userProfile.bigfive}
        completedSteps={Object.keys(checkedSteps).filter((key) => checkedSteps[key])}
      />
    </div>
  );
}
