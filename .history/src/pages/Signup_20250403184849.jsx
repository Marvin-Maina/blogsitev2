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

    alert("Signup successful! Please check your email to confirm your account.");

    // Instead of fetching the user here, use the auth listener to get session 
    supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session?.user;
      if (currentUser) {
    
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: currentUser.id, email: currentUser.email, role }]);

        if (insertError) {
          console.error("Profile insertion error:", insertError);
          alert("Signup successful, but failed to create profile.");
        } else {
          console.log("Profile saved successfully.");
        }

        // After the session is established, navigate to login or dashboard
        navigate("/login");
      } else {
        console.log("User session not available yet.");
      }
    });

    setLoading(false);
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
