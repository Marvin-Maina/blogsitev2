import { useState } from "react";
import auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const finalRole = email.endsWith("@admin.com") ? "admin" : role;

        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          role: finalRole,
        });

        navigateByRole(finalRole);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const userData = docSnap.data();
          navigateByRole(userData.role);
        } else {
          setError("User profile not found in Firestore.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const navigateByRole = (role) => {
    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "writer") navigate("/writer-dashboard");
    else if (role === "editor") navigate("/editor-dashboard");
    else navigate("/user-dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">{isSignup ? "Sign Up" : "Log In"}</h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded bg-gray-700 border border-gray-600"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          {isSignup && !email.endsWith("@admin.com") && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600"
            >
              <option value="user">User</option>
              <option value="writer">Writer</option>
              <option value="editor">Editor</option>
            </select>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} className="underline text-purple-400">
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
