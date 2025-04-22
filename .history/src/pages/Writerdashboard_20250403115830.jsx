import { useEffect, useState } from "react";
import { useAuth } from "../pages/Authprovider";
import supabase from "../supabase";

export default function WriterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, drafts: 0, published: 0 });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      const { data, error } = await supabase
      .from("articles") 
      .select("id, title, status, created_at")  
      .eq("author_id", user.id) 
      .order("created_at", { ascending: false })  
      .limit(5); 
      console.log("Fetched Articls:", data)
      if (error) {
        console.error("Error fetching stats:", error);
      } else {
        setArticles(data)
      }

      const total = data.length;
      const drafts = data.filter((article) => article.status === "draft").length;
      const published = total - drafts;

      setStats({ total, drafts, published });
    }

    async function fetchRecentArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, status, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching articles:", error);
        return;
      }

      setArticles(data);
    }

    fetchStats();
    fetchRecentArticles();
  }, [user]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6"> Writer Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Total Articles</h2>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Drafts</h2>
          <p className="text-2xl font-bold">{stats.drafts}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Published</h2>
          <p className="text-2xl font-bold">{stats.published}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8">📝 Recent Articles</h2>
      <ul className="mt-4 space-y-3">
        {articles.map((article) => (
          <li
            key={article.id}
            className="bg-gray-800 p-3 rounded-lg flex justify-between"
          >
            <span>{article.title}</span>
            <span className={`text-sm ${article.status === "published" ? "text-green-400" : "text-yellow-400"}`}>
              {article.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
