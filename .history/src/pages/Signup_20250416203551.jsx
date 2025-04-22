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
    if (email.trim().toLowerCase() === "admin@admin.com") {
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
        alert("Invalid credentials.");
      }
    } else {
      const userExists = users.some((u) => u.email === email);
      if (userExists) {
        alert("User already exists.");
        return;
      }

      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role: email === "admin@admin.com" ? "admin" : role,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful! You can now log in.");
      setIsLogin(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-violet-900 text-white px-4">
      <div className="bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {!isLogin && email.trim().toLowerCase() !== "admin@admin.com" && (
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              >
                <option value="user">User</option>
                <option value="writer">Writer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 transition duration-200 px-4 py-2 rounded font-bold tracking-wide"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-400 hover:text-violet-300 font-semibold ml-1"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
