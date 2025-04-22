import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "@/lib/authUtils";
import { fetchNewsArticles } from "@/lib/newsApi";
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

// ⭐ StarRating Component
function StarRating({ articleId }) {
  const [rating, setRating] = useState(() => {
    return Number(localStorage.getItem(`${articleId}_rating`)) || 0;
  });

  const handleRate = (value) => {
    setRating(value);
    localStorage.setItem(`${articleId}_rating`, value);
  };

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          className={`text-xl ${
            star <= rating ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// 💬 Comments Component
function Comments({ articleId }) {
  const [comments, setComments] = useState(() => {
    return JSON.parse(localStorage.getItem(`${articleId}_comments`)) || [];
  });
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      text: input,
      timestamp: new Date().toISOString(),
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`${articleId}_comments`, JSON.stringify(updatedComments));
    setInput("");
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="p-2 border rounded-md text-sm"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm self-start"
        >
          Comment
        </button>
      </form>
      <ul className="mt-2 text-sm text-gray-400 space-y-1">
        {comments.map((comment, index) => (
          <li key={index}>🗨️ {comment.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [userArticles, setUserArticles] = useState([]);

  useEffect(() => {
    const currentUser = getUserFromLocalStorage();
    setUser(currentUser);

    const allArticles = JSON.parse(localStorage.getItem("allArticles")) || [];
    const publishedUserArticles = allArticles.filter(
      (article) => article.status === "published"
    );
    setUserArticles(publishedUserArticles);

    fetchNewsArticles().then(setNewsArticles);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 md:p-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          {/* Local Writer Articles */}
          <div className="grid md:grid-cols-2 gap-6">
            {userArticles.map((article, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700"
              >
                <h2 className="text-xl font-bold text-white">{article.title}</h2>
                <p className="text-gray-400 mt-2">{article.content}</p>
                <StarRating articleId={article.title} />
                <Comments articleId={article.title} />
              </div>
            ))}
          </div>

          {/* News API Articles */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Trending Blogs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {newsArticles.map((article, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700"
              >
                <h2 className="text-lg font-bold">{article.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 text-sm mt-2 inline-block"
                >
                  Read more →
                </a>
                <StarRating articleId={article.title} />
                <Comments articleId={article.title} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
