import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ArticleList() {
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    // Local articles
    const localArticles = JSON.parse(localStorage.getItem("allArticles")) || [];
    const localWithSource = localArticles.map((article) => ({
      ...article,
      source: "local",
    }));

    // NewsAPI articles
    let newsWithSource = [];
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=e40f38c405f74cedbcabe84ef9599f37`
      );
      const data = await res.json();
      newsWithSource = data.articles.map((article) => ({
        ...article,
        source: "news",
      }));
    } catch (err) {
      console.error("Failed to fetch news articles:", err);
    }

    // Combine both
    setAllArticles([...localWithSource, ...newsWithSource]);
  };

  const filteredArticles = allArticles.filter((article) =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Articles</h1>
        <button
          onClick={() => navigate("/dashboard/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Article
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Search className="text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder="Search all articles and blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {filteredArticles.length > 0 ? (
        <ul className="grid gap-4">
          {filteredArticles.map((article, index) => (
            <li
              key={index}
              className="p-4 border rounded-md shadow-sm bg-card hover:bg-muted transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <span className="text-xs text-gray-500 italic">
                  {article.source === "local" ? "My Blog" : "News"}
                </span>
              </div>
              {article.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {article.description}
                </p>
              )}
              {article.source === "local" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit/${article.id}`)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No articles match your search 🔍</p>
      )}
    </div>
  );

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    const updatedArticles = allArticles.filter(
      (article) => article.id !== id || article.source !== "local"
    );
    setAllArticles(updatedArticles);
    const remainingLocal = updatedArticles.filter((a) => a.source === "local");
    localStorage.setItem("allArticles", JSON.stringify(remainingLocal));
  }
}
