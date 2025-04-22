import { useEffect, useState, useContext } from "react";
import { useAuth } from "../pages/Authprovider";
import { ThemeContext } from "../ThemeContext";

export default function WriterDashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext); // Grab the current dark mode context
  const [stats, setStats] = useState({ total: 0, drafts: 0, published: 0 });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!user) return;

    const storedArticles = JSON.parse(localStorage.getItem("allArticles")) || [];

    const writerArticles = storedArticles
    .filter((article) => article.authorId === user.id)
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
  const getTextOnly = (htmlOrText) => {
    
    const withoutImgTags = htmlOrText.replace(/<img[^>]*>/g, '');
  
    const withoutImageUrls = withoutImgTags.replace(/https?:\/\/\S+\.(jpg|jpeg|png|gif)/gi, '');
  
    
    const textOnly = withoutImageUrls.replace(/<[^>]+>/g, '');
  
    return textOnly;
  };
  

  return (
    <div
      className={`p-6 min-h-screen transition duration-300 ${
        isDarkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-extrabold mb-6 tracking-tight ${
          isDarkMode ? "text-violet-300" : "text-violet-600"
        }`}
      >
        ✍️ Writer Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <StatCard label="Total Articles" value={stats.total} />
        <StatCard label="Drafts" value={stats.drafts} color="yellow" />
        <StatCard label="Published" value={stats.published} color="green" />
      </div>

      <h2
        className={`text-2xl font-bold mt-10 mb-4 tracking-tight ${
          isDarkMode ? "text-violet-300" : "text-violet-700"
        }`}
      >
        📝 Recent Articles
      </h2>
      <ul className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <li
              key={article.id}
              className={`${
                isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
              } transition-all p-4 rounded-xl flex justify-between items-start shadow-md`}
            >
              <div className="flex flex-col w-3/4">
                <span
                  className={`${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } font-semibold text-lg`}
                >
                  {article.title}
                </span>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm mt-1`}
                >
                  {getContentPreview(article.content)}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                  article.status === "published"
                    ? isDarkMode
                      ? "bg-green-900 text-green-400"
                      : "bg-green-200 text-green-700"
                    : isDarkMode
                    ? "bg-yellow-900 text-yellow-400"
                    : "bg-yellow-200 text-yellow-700"
                }`}
              >
                {article.status}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-400 italic">
            You haven't written anything yet... 👀
          </li>
        )}
      </ul>
    </div>
  );
}

function StatCard({ label, value, color = "white" }) {
  const { isDarkMode } = useContext(ThemeContext); // Grab the current dark mode context

  const textColor =
    color === "yellow"
      ? isDarkMode
        ? "text-yellow-400"
        : "text-yellow-600"
      : color === "green"
      ? isDarkMode
        ? "text-green-400"
        : "text-green-600"
      : isDarkMode
      ? "text-white"
      : "text-gray-900";

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
    >
      <h2
        className={`text-md font-semibold mb-1 ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </h2>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}