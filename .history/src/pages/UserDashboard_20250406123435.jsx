import { useEffect, useState } from 'react';
import { useAuth } from '../pages/Authprovider';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem('userActivity')) || [];
    setRecentActivity(activity);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=e40f38c405f74cedbcabe84ef9599f37');
        const data = await res.json();
        if (data.status === 'ok') {
          setNewsArticles(data.articles.slice(0, 5)); // Limit to 5
        } else {
          throw new Error('Failed to fetch news');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || 'User'}!</h1>

      {/* Recent Activity */}
      <h2 className="text-2xl font-bold mt-8">Recent Activity</h2>
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
      <h2 className="text-2xl font-bold mt-8">📡 Latest News</h2>

      {error ? (
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
                className="text-violet-400 mt-3 inline-block"
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
