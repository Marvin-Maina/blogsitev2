import { useEffect, useState } from "react";
import { useAuth } from "../pages/Authprovider";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

export default function WriterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      if (!user) return;
      
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

    fetchArticles();
  }, [user]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">Writer Dashboard</h1>
      <button
        onClick={() => navigate("/editor")}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition mb-6"
      >
        ✍️ New Article
      </button>
      
      {loading ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p>No articles found. Start writing!</p>
      ) : (
        <ul className="w-full max-w-3xl space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-400">Status: {article.status}</p>
              <button
                onClick={() => navigate(`/editor/${article.id}`)}
                className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded transition"
              >
                ✏️ Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
