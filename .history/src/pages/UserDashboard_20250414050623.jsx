import { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem('allArticles')) || [];
    setArticles(storedArticles);

    const savedComments = JSON.parse(localStorage.getItem('comments')) || {};
    const savedLikes = JSON.parse(localStorage.getItem('likes')) || {};
    setComments(savedComments);
    setLikes(savedLikes);

    const fetchNews = async () => {
      try {
        const res = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY');
        const data = await res.json();
        setNewsArticles(data.articles);
      } catch (err) {
        console.error('News API failed:', err);
      }
    };

    fetchNews();
  }, []);

  const handleCommentChange = (title, newComment) => {
    const updatedComments = {
      ...comments,
      [title]: newComment,
    };
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const handleLikeToggle = (title) => {
    const updatedLikes = {
      ...likes,
      [title]: !likes[title],
    };
    setLikes(updatedLikes);
    localStorage.setItem('likes', JSON.stringify(updatedLikes));
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-3xl font-bold mb-6 text-purple-500">User Dashboard</h2>

      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Latest News Articles</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <li
              key={article.title}
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
              <p className={`text-sm italic mb-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                {article.source.name}
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline text-sm transition-colors duration-200"
              >
                Read More
              </a>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLikeToggle(article.title)}
                    className={`text-2xl transition-transform duration-200 ${
                      likes[article.title] ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-pink-500'
                    }`}
                  >
                    ❤️
                  </button>
                  <span className="text-sm">
                    {likes[article.title] ? 'You and others liked this' : 'Be the first to like'}
                  </span>
                </div>
                <textarea
                  className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Write your comment..."
                  value={comments[article.title] || ''}
                  onChange={(e) => handleCommentChange(article.title, e.target.value)}
                ></textarea>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">User Articles</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <li
              key={article.id}
              className={`p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] border ${
                isDarkMode
                  ? 'bg-gray-800 bg-opacity-90 border-purple-800'
                  : 'bg-white bg-opacity-90 border-purple-300'
              }`}
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-sm italic mb-1 text-purple-400">By {article.author || 'Unknown'}</p>
              <p className="mb-4">{article.content}</p>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLikeToggle(article.title)}
                    className={`text-2xl transition-transform duration-200 ${
                      likes[article.title] ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-pink-500'
                    }`}
                  >
                    ❤️
                  </button>
                  <span className="text-sm">
                    {likes[article.title] ? 'You and others liked this' : 'Be the first to like'}
                  </span>
                </div>
                <textarea
                  className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Write your comment..."
                  value={comments[article.title] || ''}
                  onChange={(e) => handleCommentChange(article.title, e.target.value)}
                ></textarea>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
