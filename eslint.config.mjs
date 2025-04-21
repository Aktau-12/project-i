import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js, pluginReact },
    extends: [
      "js/recommended",
      pluginReact.configs.recommended,  // Подключаем конфигурацию React
      tseslint.configs.recommended,     // Настройки для TypeScript
    ],
    languageOptions: {
      globals: {
        ...globals.browser,  // Глобальные переменные для браузера
        process: "readonly", // Добавляем process как глобальную переменную
        global: "readonly",  // Добавляем global как глобальную переменную
      },
    },
  },
]);
