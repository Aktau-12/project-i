import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");    // ✅ Имя пользователя
  const [email, setEmail] = useState("");   // Почта
  const [password, setPassword] = useState(""); // Пароль
  const [confirmPassword, setConfirmPassword] = useState(""); // Повтор пароля
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("⛔ Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("⛔ Пароли не совпадают");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,    // ✅ Теперь отправляется и имя
        email,
        password,
      });
      console.log("✅ Регистрация успешна:", response.data);
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError("⛔ Этот email уже зарегистрирован!");
      } else {
        setError("❌ Ошибка регистрации. Попробуйте снова.");
      }
      console.error("❌ Ошибка регистрации:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Регистрация</h2>

        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
