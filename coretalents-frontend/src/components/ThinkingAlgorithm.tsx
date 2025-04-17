import React, { useState } from "react";
import HabitTracker from "../Pages/HabitTracker"; // ✅ если HabitTracker лежит в pages

const steps = [
  {
    question: "🧠 Какая у тебя сейчас задача или проблема?",
    placeholder: "Опиши кратко, в 1-2 предложениях",
  },
  {
    question: "🔍 Что ты уже пробовал сделать?",
    placeholder: "Например: советовался с кем-то, искал в интернете, пробовал решить",
  },
  {
    question: "🎯 Какая твоя конечная цель?",
    placeholder: "Например: найти решение, устранить причину, добиться результата",
  },
  {
    question: "🧩 Какие ресурсы у тебя есть?",
    placeholder: "Люди, знания, время, опыт, инструменты",
  },
  {
    question: "🚧 Какие у тебя ограничения?",
    placeholder: "Например: мало времени, нет поддержки, страх неудачи",
  },
  {
    question: "💡 Какие есть хотя бы 3 возможных пути?",
    placeholder: "Придумай любые 3 варианта действий",
  },
  {
    question: "✅ Какой вариант ты выберешь сейчас?",
    placeholder: "Напиши тот, что тебе ближе — интуитивно или логически",
  },
  {
    question: "📅 Когда ты начнёшь? Установи дату и время",
    placeholder: "Например: завтра в 10:00 или 'после обеда в пятницу'",
  },
  {
    question: "🔁 Добавить в привычку? Чтобы делать это регулярно?",
    placeholder: "Да/Нет. Можно будет сразу внести в HabitTracker",
  },
];

const ThinkingAlgorithm = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(""));

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[stepIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-center mb-4">🧠 Алгоритм мышления</h2>

      <div>
        <p className="text-lg font-medium mb-2">{steps[stepIndex].question}</p>
        <textarea
          value={answers[stepIndex]}
          onChange={handleChange}
          rows={4}
          placeholder={steps[stepIndex].placeholder}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          ⬅ Назад
        </button>
        {!isLastStep ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Далее ➡
          </button>
        ) : (
          <button
            onClick={() => alert("🎉 Готово! Все шаги пройдены.")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Завершить ✅
          </button>
        )}
      </div>

      {/* Можно добавить HabitTracker по желанию */}
      {answers[8]?.toLowerCase().includes("да") && (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">🔁 Добавлено в блок Привычки:</h3>
          <HabitTracker />
        </div>
      )}
    </div>
  );
};

export default ThinkingAlgorithm;
