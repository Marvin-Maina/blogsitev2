import { useEffect, useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../pages/Authprovider';
import { ThemeContext } from '../ThemeContext';
import CommentSection from '../components/CommentSection';

export default function UserDashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [recentActivity, setRecentActivity] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  if (user.role !== 'user') {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  const getTextOnlyPreview = (markdown) => {
    return (
      markdown
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/[*_~#>]/g, '')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .slice(0, 150)
        .trim() + '...'
    );
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://newsapi.org/v2/top-headlines?country=us&apiKey=e40f38c405f74cedbcabe84ef9599f37'
        );
        const data = await response.json();
        if (data.status === 'ok') {
          setNewsArticles(data.articles.slice(0, 6));
        } else {
          throw new Error('Failed to fetch news');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem('userActivity')) || [];
    setRecentActivity(activity);
  }, [user]);

  useEffect(() => {
    if (!user?.name) return;
    const savedArticles = JSON.parse(localStorage.getItem('allArticles')) || [];
    const localWriterArticles = savedArticles.filter(
      (article) => article.status === 'published' && article.author !== user.name
    );
    setUserArticles(localWriterArticles);
  }, [user?.name]);

  const handleReadMore = (article) => {
    navigate(`/full-article/${encodeURIComponent(article.title)}`, {
      state: { article },
    });
  };

  return (
    <div
      className={`p-6 min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h1 className="text-4xl font-extrabold text-purple-400 mb-10">Welcome!</h1>

      {/* 🕒 Recent Activity */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">🕒 Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivity.length === 0 ? (
            <li className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No recent activity found.
            </li>
          ) : (
            recentActivity.map((activity) => (
              <li
                key={activity.title}
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-200'
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              >
                <div className="flex justify-between">
                  <span>{activity.title}</span>
                  <span className="text-sm opacity-70">{activity.timestamp}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* 📰 News Section */}
      <div className="mb-14">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">📰 Latest News</h2>
        {loading ? (
          <p className="text-gray-400">Loading news...</p>
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsArticles.map((article) => (
              <li
                key={article.title}
                className={`p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border ${
                  isDarkMode ? 'bg-gray-800 border-purple-800' : 'bg-white border-purple-300'
                }`}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-sm italic mb-1 text-purple-500">{article.source.name}</p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                  {article.description}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline text-sm transition-colors duration-200"
                >
                  Read More
                </a>
                <div className="mt-4">
                  <CommentSection articleId={article.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="my-12 border-purple-600 opacity-30" />

      {/* ✨ Local Writers' Articles */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-purple-300 mb-2">✨ Articles from Local Writers</h2>
        <p className={`mb-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Check out articles written by our local writers.
        </p>
        {userArticles.length === 0 ? (
          <p className="text-gray-400">There are no published articles from local writers yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userArticles.map((article) => (
              <li
                key={article.title}
                className={`p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border ${
                  isDarkMode ? 'bg-gray-800 border-purple-800' : 'bg-white border-purple-300'
                }`}
              >
                <img
                  src={article.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                  alt={article.title}
                  className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
                />
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                  {getTextOnlyPreview(article.content)}
                </p>
                <button
                  onClick={() => handleReadMore(article)}
                  className="mt-2 text-purple-400 hover:text-purple-300 underline text-sm transition-colors duration-200"
                >
                  Read More
                </button>
                <div className="mt-4">
                  <CommentSection articleId={article.title} isDarkMode={isDarkMode} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
