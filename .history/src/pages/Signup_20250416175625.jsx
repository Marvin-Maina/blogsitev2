import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false); // Toggle between Login and Signup
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAdminEmail = email.trim().toLowerCase().endsWith("@admin.com");
    const finalRole = isAdminEmail ? "admin" : role;

    if (isLogin) {
      // Handle Login
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard"); // Redirect to admin dashboard
      } else if (user.role === "writer") {
        navigate("/writer-dashboard"); // Redirect to writer dashboard
      } else {
        navigate("/user-dashboard"); // Redirect to user dashboard
      }
    } else {
      // Handle Signup
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const emailExists = existingUsers.some((user) => user.email === email);

      if (emailExists) {
        setError("A user with this email already exists.");
        return;
      }

      const userData = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role: finalRole,
      };

      const updatedUsers = [...existingUsers, userData];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Redirect to Login page after successful signup
      setIsLogin(true);
      setError(""); // Clear any existing error
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Log In" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {!isLogin && !email.toLowerCase().endsWith("@admin.com") && (
            <div>
              <label className="block mb-1 text-sm">Choose your role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
              >
                <option value="user">User</option>
                <option value="writer">Writer</option>
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-md font-semibold"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-500 hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
