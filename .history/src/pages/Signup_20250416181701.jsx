import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { twMerge } from "tailwind-merge";

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (email === "admin@admin.com") {
      setRole("admin");
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (existingUser) {
        localStorage.setItem("user", JSON.stringify(existingUser));
        navigate(`/${existingUser.role}-dashboard`);
      } else {
        alert("Invalid credentials");
      }
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some((u) => u.email === email);

      if (userExists) {
        alert("User already exists");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: email === "admin@admin.com" ? "admin" : role,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! You can now log in.");
      setIsLogin(true); // switch to login view
    }
  };

  return (
    <div className={twMerge(
      "min-h-screen flex items-center justify-center transition-colors duration-300",
      isDarkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-800"
    )}>
      <div className="bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && email !== "admin@admin.com" && (
            <select
              className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="writer">Writer</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded bg-purple-700 hover:bg-purple-600 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-purple-400 underline hover:text-purple-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupLogin;
