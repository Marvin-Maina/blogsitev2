import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../pages/Authprovider';
import { ThemeContext } from '../ThemeContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [recentActivity, setRecentActivity] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = () => {
      const activity = JSON.parse(localStorage.getItem('userActivity')) || [];
      setRecentActivity(activity);
    };
    fetchRecentActivity();
  }, [user]);

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
    const fetchUserArticles = () => {
      const savedArticles = JSON.parse(localStorage.getItem('articles')) || [];
      const publishedArticles = savedArticles.filter((article) => article.status === 'published');
      setUserArticles(publishedArticles);
    };
    fetchUserArticles();
  }, []);
  

  return (
    <div
      className={`p-6 min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h1 className="text-4xl font-extrabold text-purple-400 mb-10">Welcome!</h1>

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">🕒 Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivity.length === 0 ? (
            <li className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No recent activity found.
            </li>
          ) : (
            recentActivity.map((activity, index) => (
              <li
                key={index}
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

      {/* News Section */}
      <div>
        <h2 className="text-3xl font-bold text-purple-300 mb-4">📰 Latest Blogs</h2>

        {loading ? (
          <p className="text-gray-400">Loading news...</p>
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsArticles.map((article, index) => (
              <li
                key={index}
                className={`p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] border ${
                  isDarkMode
                    ? 'bg-gray-800 bg-opacity-90 border-purple-800'
                    : 'bg-white bg-opacity-90 border-purple-300'
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
                <p
                  className={`text-sm italic mb-1 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-700'
                  }`}
                >
                  {article.source.name}
                </p>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
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
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Divider */}
      <hr className="my-12 border-purple-600 opacity-30" />

      {/* Creator Articles */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-purple-300 mb-2">✨ Following the headlines...</h2>
        <p
          className={`mb-4 text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Dive into exclusive articles from our creators
        </p>

        {userArticles.length === 0 ? (
          <p className="text-gray-400">You have no published articles yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userArticles.map((article, index) => (
              <li
                key={index}
                className={`p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] border ${
                  isDarkMode
                    ? 'bg-gray-800 bg-opacity-90 border-purple-800'
                    : 'bg-white bg-opacity-90 border-purple-300'
                }`}
              >
                <img
                  src={article.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                  alt={article.title}
                  className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
                />
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {article.content?.substring(0, 150)}...
                </p>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-purple-400 hover:text-purple-300 underline text-sm transition-colors duration-200"
                >
                  Read More
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
