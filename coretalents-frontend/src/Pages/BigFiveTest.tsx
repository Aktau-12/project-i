import axios from "axios";
import { useNavigate } from "react-router-dom";
import BigFiveResults from "./BigFiveResults";

interface Question {
  id: number;
  text: string;
}

interface BigFiveResult {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export default function BigFiveTest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<BigFiveResult | null>(null);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/tests/2/questions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("❌ Ошибка загрузки вопросов:", err));
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    setTimer(20);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleNext();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [current, questions]);

  const getTraitByQuestionId = (id: number): keyof BigFiveResult => {
    const index = (id - 1) % 50;
    if (index < 10) return "O";
    if (index < 20) return "C";
    if (index < 30) return "E";
    if (index < 40) return "A";
    return "N";
  };

  const calculateBigFive = (answers: Record<number, string>): BigFiveResult => {
    const traits: BigFiveResult = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const count = { O: 0, C: 0, E: 0, A: 0, N: 0 };

    for (const id in answers) {
      const trait = getTraitByQuestionId(parseInt(id));
      const value = parseInt(answers[id]);
      traits[trait] += value;
      count[trait]++;
    }

    const result: BigFiveResult = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    for (const trait in traits) {
      result[trait as keyof BigFiveResult] = +(traits[trait as keyof BigFiveResult] / count[trait as keyof BigFiveResult]).toFixed(2);
    }
    return result;
  };

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const payload = questions.map((q) => ({
      question_id: q.id,
      answer: parseInt(answers[q.id]) || 2,
    }));

    const computed = calculateBigFive(answers);

    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "/tests/2/submit",
        { answers: payload, result: computed },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResult(computed);
      setSubmitted(true);
    } catch (error) {
      console.error("❌ Ошибка отправки:", error);
    }
  };

  if (submitted && result) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Ваши результаты Big Five</h2>
        <BigFiveResults data={result} />
        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            🔙 Назад в меню
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🚪 Выйти
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return <div className="p-6 text-center">Загрузка...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Big Five Test</h1>

      {/* Таймер и прогресс сверху */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>⏳ Осталось времени: <span className="font-bold">{timer}</span> сек</div>
        <div>Вопрос {current + 1} из {questions.length}</div>
      </div>

      <div className="border p-4 rounded">
        <p className="font-medium mb-4">
          {current + 1}. {q.text || "(вопрос пуст)"}
        </p>

        <div className="flex justify-around mb-4">
          {[1, 2, 3].map((value) => (
            <label key={value} className="flex flex-col items-center">
              <input
                type="radio"
                name={`q-${q.id}`}
                value={value}
                checked={answers[q.id] === value.toString()}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
              <span className="text-sm mt-1">
                {value === 1 ? "Это не про меня" : value === 2 ? "Не знаю" : "Это точно про меня"}
              </span>
            </label>
          ))}
        </div>

        {/* Визуальный прогресс-бар таймера */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${(timer / 20) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Завершить тест
        </button>

        {answers[q.id] !== undefined && current < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Следующий ➡️
          </button>
        )}
      </div>
    </div>
  );
}
