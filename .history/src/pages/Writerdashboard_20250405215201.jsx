import { useEffect, useState } from "react";
import { useAuth } from "../pages/Authprovider";

export default function WriterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, drafts: 0, published: 0 });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch articles from localStorage
    const storedArticles = JSON.parse(localStorage.getItem("articles")) || [];

    // Filter only writer's articles
    const writerArticles = storedArticles
      .filter((article) => article.author_id === user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5); // limit to 5 recent ones

    setArticles(writerArticles);

    const total = writerArticles.length;
    const drafts = writerArticles.filter((a) => a.status === "draft").length;
    const published = total - drafts;

    setStats({ total, drafts, published });
  }, [user]);

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">✍️ Writer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Total Articles</h2>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Drafts</h2>
          <p className="text-3xl font-bold text-yellow-400">{stats.drafts}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Published</h2>
          <p className="text-3xl font-bold text-green-400">{stats.published}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-3">📝 Recent Articles</h2>
      <ul className="space-y-3">
        {articles.length > 0 ? (
          articles.map((article) => (
            <li
              key={article.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <span className="text-white font-medium">{article.title}</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  article.status === "published"
                    ? "bg-green-900 text-green-400"
                    : "bg-yellow-900 text-yellow-400"
                }`}
              >
                {article.status}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-400 italic">No articles yet...</li>
        )}
      </ul>
    </div>
  );
}
