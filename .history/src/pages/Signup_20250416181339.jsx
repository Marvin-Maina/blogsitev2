import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup= () => {
  const [isSignup, setIsSignup] = useState(true);  // Switch between signup/login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = { email, password, role };
    // Save user info to localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to the appropriate dashboard based on the user's role
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "writer") {
      navigate("/writer-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">{isSignup ? "Sign Up" : "Login"}</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md"
            required
          />
        </div>

        {isSignup && (
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="writer">Writer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignup(false)}
                className="text-blue-500 cursor-pointer"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                className="text-blue-500 cursor-pointer"
              >
                Sign up here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Signup
