import { useState } from "react";  // Оставить только useState
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState(""); // 👤 Имя
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Ошибка регистрации");
      }

      const data = await response.json();
      if (data.access_token) {
        // Сохраняем токен в localStorage
        localStorage.setItem("access_token", data.access_token);

        // Перенаправляем на страницу логина
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка сети");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 Регистрация</h1>

      <input
        type="text"
        placeholder="Имя"
        className="w-full mb-3 p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Почта"
        className="w-full mb-3 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Пароль"
        className="w-full mb-3 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Повторите пароль"
        className="w-full mb-3 p-2 border rounded"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Зарегистрироваться
      </button>

      <p className="text-center mt-4 text-sm">
        Уже есть аккаунт?{" "}
        <a href="/login" className="text-blue-600 underline">
          Войти
        </a>
      </p>
    </div>
  );
}
