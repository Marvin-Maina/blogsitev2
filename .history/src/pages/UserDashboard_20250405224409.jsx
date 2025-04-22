import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=e40f38c405f74cedbcabe84ef9599f37');
        const data = await response.json();

        if (data.status === 'ok') {
          // Limit to the first 5 articles
          setNews(data.articles.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center text-lg animate-pulse">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 transition-transform transform hover:scale-105 duration-300">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover rounded-md mb-4 transition-all duration-300 transform hover:scale-105"
              />
            )}
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{article.title}</h3>
            <p className="text-gray-600 mb-4">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
