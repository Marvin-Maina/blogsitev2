import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("writer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup() {
    setLoading(true);

    // Create user
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Signup Error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Signup successful! Redirecting to your dashboard...");

    // Fetch the authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.error("Failed to fetch user after signup:", userError);
      alert("Signup successful, but user verification failed.");
      setLoading(false);
      return;
    }

    const user = userData.user;

    // Insert user profile into 'profiles' table
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, email: user.email, role }]);

    if (insertError) {
      console.error("Profile insertion error:", insertError);
      alert("Signup successful, but failed to create profile.");
      setLoading(false);
      return;
    }

    // ✅ Fetch user role from database to ensure correct redirection
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user role:", profileError);
      alert("Signup successful, but we couldn't determine your role.");
      setLoading(false);
      return;
    }

    const userRole = profile.role;

    setLoading(false);

    // ✅ Redirect based on role
    if (userRole === "writer") {
      navigate("/");
    } else {
      navigate("/user-dashboard"); // 👈 Make sure this route exists in `App.js`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          >
            <option value="writer">Writer</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full p-3 bg-indigo-500 hover:bg-indigo-600 rounded text-white font-semibold transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
