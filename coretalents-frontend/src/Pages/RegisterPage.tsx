import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("⛔ Пожалуйста, заполните все поля.");
      return;
    }

    if (password !== confirmPassword) {
      setError("⛔ Пароли не совпадают.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { access_token, token_type } = res.data;

      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setError("⛔ Этот email уже зарегистрирован!");
        } else if (err.response.status === 500) {
          setError("❌ Ошибка сервера. Попробуйте позже.");
        } else {
          setError("❌ Произошла ошибка. Попробуйте снова.");
        }
      } else {
        setError("❌ Нет связи с сервером.");
      }
      console.error("❌ Ошибка регистрации:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Регистрация</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
        />

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
