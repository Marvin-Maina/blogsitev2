import { Navigate } from "react-router-dom";
import { useAuth } from "./Authprovider";
import supabase from "../supabase";
import BlogList from "../components/BlogList";

function Dashboard() {
    const { user, role, loading } = useAuth();

    if (loading) return <p className="text-center text-gray-400">Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    async function handleLogout() {
        await supabase.auth.signOut();
        window.location.href = "/login"; 
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
            <div className="w-full max-w-4xl bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-indigo-400">Welcome, {user?.email}</h1>
                <p className="text-gray-400 mt-1">Your role: <span className="font-semibold text-indigo-300">{role}</span></p>

                <div className="flex gap-4 mt-4">
                    {role === "writer" && (
                        <button onClick={() => } className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                            ✍️ New Article
                        </button>
                    )}
                    {role === "admin" && (
                        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition">
                            ⚙️ Manage Articles
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    <BlogList role={role} />
                </div>

                <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded transition mt-4">
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
