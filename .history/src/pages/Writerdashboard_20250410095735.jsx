import { useEffect, useState } from "react";
import { useAuth } from "../pages/Authprovider";

export default function WriterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, drafts: 0, published: 0 });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!user) return;

    const storedArticles = JSON.parse(localStorage.getItem("articles")) || [];

    const writerArticles = storedArticles
      .filter((article) => article.author_id === user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    setArticles(writerArticles);

    const total = writerArticles.length;
    const drafts = writerArticles.filter((a) => a.status === "draft").length;
    const published = total - drafts;

    setStats({ total, drafts, published });
  }, [user]);

  const getContentPreview = (content, length = 100) =>
    content.length > length ? content.substring(0, length) + "..." : content;

  return (
    <div className="p-6 bg-gray-950 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 tracking-tight">✍️ Writer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <StatCard label="Total Articles" value={stats.total} />
        <StatCard label="Drafts" value={stats.drafts} color="yellow" />
        <StatCard label="Published" value={stats.published} color="green" />
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight">📝 Recent Articles</h2>
      <ul className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <li
              key={article.id}
              className="bg-gray-800 hover:bg-gray-700 transition-all p-4 rounded-xl flex justify-between items-start shadow-md"
            >
              <div className="flex flex-col w-3/4">
                <span className="text-white font-semibold text-lg">{article.title}</span>
                <p className="text-sm text-gray-400 mt-1">
                  {getContentPreview(article.content)}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
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
          <li className="text-gray-400 italic">You haven't written anything yet... 👀</li>
        )}
      </ul>
    </div>
  );
}

function StatCard({ label, value, color = "white" }) {
  const textColor =
    color === "yellow"
      ? "text-yellow-400"
      : color === "green"
      ? "text-green-400"
      : "text-white";

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-md font-semibold mb-1">{label}</h2>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
