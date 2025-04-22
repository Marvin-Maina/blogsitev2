import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  useEffect(() => {
    if (email === "admin@admin.com") {
      setRole("admin");
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
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

      // 🔥 Auto-login and redirect
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate(`/${newUser.role}-dashboard`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-violet-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1">Name:</label>
              <input
                className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1">Email:</label>
            <input
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password:</label>
            <input
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && email !== "admin@admin.com" && (
            <div>
              <label className="block mb-1">Role:</label>
              <select
                className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="writer">Writer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 transition duration-200 px-4 py-2 rounded font-semibold"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-violet-400 hover:underline ml-1"
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
