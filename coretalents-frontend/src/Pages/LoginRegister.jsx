import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginRegister() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, loginData);
      const { access_token, token_type } = res.data;
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("⛔ Неверный логин или пароль.");
      } else {
        setError("❌ Ошибка входа. Попробуйте снова.");
      }
      console.error("❌ Ошибка входа:", err);
    }
  };

  const handleRegister = async () => {
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, registerData);
      const { access_token, token_type } = res.data;
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("⛔ Пользователь с таким email уже существует.");
      } else if (err.response?.status === 500) {
        setError("❌ Ошибка сервера. Попробуйте позже.");
      } else {
        setError("❌ Ошибка регистрации. Попробуйте снова.");
      }
      console.error("❌ Ошибка регистрации:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl shadow-xl">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <Tabs defaultValue="login">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Input
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            className="mb-4"
          />
          <Input
            name="password"
            type="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={handleLoginChange}
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full">
            Войти
          </Button>
        </TabsContent>

        <TabsContent value="register">
          <Input
            name="name"
            placeholder="Имя"
            value={registerData.name}
            onChange={handleRegisterChange}
            className="mb-4"
          />
          <Input
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleRegisterChange}
            className="mb-4"
          />
          <Input
            name="password"
            type="password"
            placeholder="Пароль"
            value={registerData.password}
            onChange={handleRegisterChange}
            className="mb-4"
          />
          <Button onClick={handleRegister} className="w-full">
            Зарегистрироваться
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
