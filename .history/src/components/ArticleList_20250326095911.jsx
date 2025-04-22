import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ArticleList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    let { data, error } = await supabase.from("articles").select("*");
    if (error) console.error("Error fetching articles:", error);
    else setArticles(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    let { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error("Error deleting article:", error);
    } else {
      setArticles(articles.filter((article) => article.id !== id)); 
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Article List</h1>
      <button 
        onClick={() => navigate("/dashboard/new")} 
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        + Add Article
      </button>

      <ul className="mt-4">
        {articles.map((article) => (
          <li key={article.id} className="p-3 border-b flex justify-between">
            <div>
              <strong>{article.title}</strong>
            </div>
            <div>
              <button 
                onClick={() => navigate(`/dashboard/edit/${article.id}`)} 
                className="bg-gray-500 text-white px-3 py-1 rounded mx-2"
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
          </li>
        ))}
      </ul>
    </div>
  );
}
