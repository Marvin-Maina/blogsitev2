import { useAuth } from "./UseAuth";
import BlogList from "../components/BlogList";

function Dashboard() {
    const { user, role, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
            <p className="text-gray-400">Your role: {role}</p>

          
            {role === "writer" && (
                <button className="bg-blue-500 text-white p-2 rounded my-4">
                    ✍️ New Article
                </button>
            )}
            {role === "admin" && (
                <button className="bg-red-500 text-white p-2 rounded my-4">
                    ⚙️ Manage Articles
                </button>
            )}

          
            <BlogList role={role} />
        </div>
    );
}

export default Dashboard;
