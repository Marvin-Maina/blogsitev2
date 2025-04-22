import React from "react";
import { useTheme } from "../ThemeContext"; 

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(prev => !prev)}
      className={`p-2 rounded-full ${
        isDarkMode ? "bg-violet-700 text-white" : "bg-violet-300 text-black"
      } transition duration-300`}
    >
      {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
