import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("writer"); // Default role
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup() {
    setLoading(true);

    // 1️⃣ Sign Up the User
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Signup Error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    let user = data?.user;
    console.log("User signed up:", user);

    
    if (!user) {
      console.warn("No user returned, fetching manually...");
      const { data: session } = await supabase.auth.getSession();
      user = session?.session?.user;

      if (!user) {
        console.error("Failed to fetch user after signup.");
        alert("Signup successful, but profile couldn't be created.");
        setLoading(false);
        return;
      }
    }

    console.log("Final User Data:", user);

    // 3️⃣ Insert Profile into 'profiles' Table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, role }]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      alert(`Error saving role: ${profileError.message}`);
    } else {
      console.log("Profile saved successfully.");
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
