import { useEffect, useState } from "react";
import { useAuth } from "../pages/Authprovider";
import supabase from "../supabase";

export default function UserPage() {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchUserArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, status, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
      } else {
        setArticles(data);
      }
      setLoading(false);
    }

    fetchUserArticles();
  }, [user]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      {user && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 text-center">
          <img
            src={`https://ui-avatars.com/api/?name=${user.email}`}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold">{user.email}</h2>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8">📝 Your Articles</h2>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="bg-gray-800 p-3 rounded-lg flex justify-between"
            >
              <span>{article.title}</span>
              <span
                className={`text-sm ${
                  article.status === "published"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {article.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
