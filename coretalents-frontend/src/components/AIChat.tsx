
import axios from "axios";

export default function AIChat() {
  const [model, setModel] = useState("gpt");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/ai/ask", {
        model,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("❌ Ошибка получения ответа от ИИ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded space-y-4">
      <h2 className="text-lg font-semibold text-center">🤖 AI-помощник</h2>

      <select
        className="border p-2 rounded w-full"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        <option value="gpt">GPT-4 Turbo</option>
        <option value="claude">Claude 3</option>
      </select>

      <textarea
        className="w-full border p-2 rounded h-24"
        placeholder="Задайте вопрос..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={sendQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        disabled={loading}
      >
        {loading ? "⏳ Загрузка..." : "🔍 Получить ответ"}
      </button>

      {answer && (
        <div className="bg-gray-100 p-4 rounded text-left whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}
