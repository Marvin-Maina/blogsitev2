import { useEffect, useState } from 'react';
import { useAuth } from '../pages/Authprovider';

export default function UserDashboard() {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent activity (same as before)
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
      setError(null); // Reset error state

      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=e40f38c405f74cedbcabe84ef9599f37');
        const data = await response.json();

        if (data.status === 'ok') {
          setNewsArticles(data.articles);
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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Welcome, {user?.name || 'User'}!</h1>

      {/* User Info Section */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-purple-400">Your Information</h2>
        <p className="mt-2">Name: {user?.name || 'N/A'}</p>
        <p>Email: {user?.email || 'N/A'}</p>
      </div>

      {/* Recent Activity */}
      <h2 className="text-2xl font-bold mt-8 text-purple-600">Recent Activity</h2>
      <ul className="mt-4 space-y-3">
        {recentActivity.length === 0 ? (
          <li className="text-gray-400">No recent activity found.</li>
        ) : (
          recentActivity.map((activity, index) => (
            <li key={index} className="bg-gray-800 p-3 rounded-lg">
              <span>{activity.title}</span>
              <span className="text-sm text-gray-400">{activity.timestamp}</span>
            </li>
          ))
        )}
      </ul>

      {/* News Section */}
      <h2 className="text-2xl font-bold mt-8 text-purple-600">📡 Latest News</h2>

      {loading ? (
        <p className="text-gray-400">Loading news...</p>
      ) : error ? (
        <p className="text-red-400">Error: {error}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {newsArticles.map((article, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-400">{article.source.name}</p>
              <p className="mt-2 text-gray-200">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 mt-3 inline-block"
              >
                Read More
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
