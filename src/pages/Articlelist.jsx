import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Articles() {
  const { user, loading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      if (user) {
        
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching articles:", error);
        } else {
          setArticles(data);
        }
      }
      setLoadingArticles(false);
    }

    fetchArticles();
  }, [user]);

  if (loading || loadingArticles) return <p className="text-center text-gray-400">Loading articles...</p>;
  console.log("Logged-in User ID:", user?.id);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-indigo-400">Your Articles</h1>
      <div className="w-full max-w-4xl bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Published Articles</h2>
        <table className="min-w-full bg-gray-700 border border-gray-800 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">No articles found</td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="py-2 px-4">{article.title}</td>
                  <td className="py-2 px-4">{article.status}</td>
                  <td className="py-2 px-4">
                    <Link to={`/editor/${article.id}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  async function handleDeleteArticle(id) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      alert("Error deleting article:", error.message);
    } else {
      setArticles(articles.filter((article) => article.id !== id));
    }
  }
}

export default Articles;