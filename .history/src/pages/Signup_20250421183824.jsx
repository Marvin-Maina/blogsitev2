import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAdminEmail = email.trim().toLowerCase().endsWith("@admin.com");
    const finalRole = isAdminEmail ? "admin" : role;

    const userData = {
      id: crypto.randomUUID(), // Unique user ID
      name,
      email,
      role: finalRole,
    };

    // Save current session user
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", finalRole);

    // Add user to users array in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Prevent duplicate email registration
    const emailExists = existingUsers.some((user) => user.email === email);
    if (emailExists) {
      setError("A user with this email already exists.");
      return;
    }

    const updatedUsers = [...existingUsers, userData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Redirect based on role
    if (finalRole === "admin") {
      window.location.href = "/admin-dashboard";
    } else if (finalRole === "writer") {
      window.location.href = "/writer-dashboard";
    } else if (finalRole === "editor") {
      window.location.href = "/editor-dashboard";
    } else {
      window.location.href = "/user-dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">SIGN UP</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {!email.toLowerCase().endsWith("@admin.com") && (
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
