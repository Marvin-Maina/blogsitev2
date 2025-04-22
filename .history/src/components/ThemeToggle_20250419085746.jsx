import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setIsDarkMode(prev => !prev);
    setTimeout(() => setIsAnimating(false), 500); 
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full hover:scale-105 transition duration-300 ${
        isDarkMode ? "bg-violet-800 text-yellow-300" : "bg-violet-200 text-purple-700"
      }`}
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <Sun className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`} />
      ) : (
        <Moon className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`} />
      )}
    </button>
  );
};

export default ThemeToggle;
