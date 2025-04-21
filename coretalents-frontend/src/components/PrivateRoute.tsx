import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  // Если токена нет, редирект на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Ставим заголовок для всех последующих запросов
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  return <>{children}</>;
}
