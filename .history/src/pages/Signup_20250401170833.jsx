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

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Wait a bit before fetching user data
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("Signup successful, but user couldn't be verified.");
      setLoading(false);
      return;
    }

    // Insert user profile with selected role
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert([{ id: user.id, role }]);

    if (profileError) {
      alert("Profile creation error");
      console.error("Profile error:", profileError);
    }

    alert("Signup successful! Please check your email to confirm your account.");
    navigate("/login");

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
            <option value="editor">Editor</option>
          </select>
        </div>
        <div className="mt-6 flex flex-col gap-3">
