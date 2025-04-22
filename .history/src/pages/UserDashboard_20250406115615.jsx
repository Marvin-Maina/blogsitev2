import { useEffect, useState } from 'react';
import { useAuth } from '../pages/Authprovider';

export default function UserDashboard() {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = () => {
      const activity = JSON.parse(localStorage.getItem('userActivity')) || [];
      setRecentActivity(activity);
    };
    fetchRecentActivity();
  }, [user]);

  // Fetch news articles
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
          setNewsArticles(data.articles.slice(0, 5)); // Only first 5 articles
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

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-purple-400 mb-6">
        Welcome, {user?.name || 'User'}!
      </h1>

      {/* User Info Section */}
      <div className="bg-gray-800 p-5 rounded-xl shadow-lg mb-8 border border-purple-700">
        <h2 className="text-2xl font-semibold text-purple-300">Your Information</h2>
        <p className="mt-3 text-gray-300">👤 Name: {user?.name || 'N/A'}</p>
        <p className="text-gray-300">📧 Email: {user?.email || 'N/A'}</p>
      </div>

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">🕒 Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivity.length === 0 ? (
            <li className="text-gray-400 italic">No recent activity found.</li>
          ) : (
            recentActivity.map((activity, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-200">{activity.title}</span>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
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
                className="bg-gray-800 bg-opacity-90 border border-purple-800 p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
                  />
                )}

                <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                <p className="text-sm text-purple-400 italic mb-1">{article.source.name}</p>
                <p className="text-gray-300 mb-3">{article.description}</p>
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
    </div>
  );
}
