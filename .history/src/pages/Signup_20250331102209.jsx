import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("writer"); // Might not be needed if trigger sets a default
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Signup Error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      console.error("Failed to fetch user after signup");
      alert("Signup successful, but profile couldn't be created");
      setLoading(false);
      return;
    }

    console.log("User signed up:", user);

    // Instead of manually inserting a profile, wait and check if it exists
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds for the trigger

    const { data: profileData, error: profileFetchError } = await supabase
      .from("public.profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileFetchError || !profileData) {
      console.error("Profile fetch error:", profileFetchError);
      alert("Signup successful, but profile couldn't be confirmed.");
    } else {
      console.log("Profile exists:", profileData);
      alert("Signup successful! You can now log in.");
      navigate("/login");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-400" />
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600">
            <option value="writer">Writer</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={handleSignup} disabled={loading}
            className="w-full p-3 bg-indigo-500 hover:bg-indigo-600 rounded text-white font-semibold transition">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
