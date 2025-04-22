import { useEffect, useState } from "react";

export default function UserArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    const published = savedArticles.filter((article) => article.status === "published");
    setArticles(published.reverse()); // latest first
  }, []);

  return (
    <div className="p-6 font-sans text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">From Our Creators ✍️</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-1">{article.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">By {article.author || "Unknown"}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {article.content.slice(0, 100)}...
              </p>
            </div>
          ))
        ) : (
          <p>No published articles yet. Stay tuned 🔥</p>
        )}
      </div>
    </div>
  );
}
