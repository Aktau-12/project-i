import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );
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
      console.error(err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { username: registerName, email: registerEmail, password: registerPassword } // 🛠 исправлено здесь
      );
      const { access_token, token_type } = res.data;
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("⛔ Пользователь с таким email уже существует.");
      } else {
        setError("❌ Ошибка регистрации. Попробуйте снова.");
      }
      console.error(err);
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full">
            Войти
          </Button>
        </TabsContent>

        <TabsContent value="register">
          <Input
            placeholder="Имя"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
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
