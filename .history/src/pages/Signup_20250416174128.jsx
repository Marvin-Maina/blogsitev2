import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // To toggle between Login and Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission for login and signup
  const handleSubmit = (e) => {
    e.preventDefault();

    const isAdminEmail = email.trim().toLowerCase().endsWith("@admin.com");
    const finalRole = isAdminEmail ? "admin" : role;

    if (isLogin) {
      // Handle login
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
        navigate("/admin-dashboard");
      } else if (user.role === "writer") {
        navigate("/writer-dashboard");
      } else if (user.role === "editor") {
        navigate("/editor-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      // Handle signup
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
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on role
      if (finalRole === "admin") {
        navigate("/admin-dashboard");
      } else if (finalRole === "writer") {
        navigate("/writer-dashboard");
      } else if (finalRole === "editor") {
        navigate("/editor-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    // If email contains '@admin.com', auto-set role to 'admin' and hide role select
    if (email.trim().toLowerCase().endsWith("@admin.com")) {
      setRole("admin");
    } else {
      setRole("user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Log In" : "Sign Up"}
        </h1>
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
              onChange={handleEmailChange}
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

          {/* Role selection only visible if email is NOT admin */}
          {!email.trim().toLowerCase().endsWith("@admin.com") && !isLogin && (
            <div>
              <label className="block mb-1 text-sm">Choose your role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700"
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
          <p
            className="text-sm text-purple-500 cursor-pointer"
            onClick={() => {
              setIsLogin(!isLogin); // Toggle between Login and Signup
              setError(""); // Clear error on switch
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up here"
              : "Already have an account? Log in here"}
          </p>
        </div>
      </div>
    </div>
  );
}
