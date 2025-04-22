import React from "react";
import { useTheme } from "../ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(prev => !prev)}
      className={`p-2 rounded-full hover:scale-105 transition duration-300 ${
        isDarkMode ? "bg-violet-800 text-yellow-300" : "bg-violet-200 text-purple-700"
      }`}
      aria-label="Toggle Theme"
    >
      {isDarkMode ? <Sun className={`w-5 `} /> : <Moon className="w-5 h-5 animate-spin" />}
    </button>
  );
};

export default ThemeToggle;
