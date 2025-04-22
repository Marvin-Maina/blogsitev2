import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../pages/Authprovider';
import { ThemeContext } from '../ThemeContext';
import ArticleModal from '../components/ArticleModal'; 
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper for carousel
import 'swiper/swiper-bundle.min.css'; // Import Swiper styles

export default function UserDashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [recentActivity, setRecentActivity] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // For search bar
  const [filteredArticles, setFilteredArticles] = useState([]);
  
  // Topics for carousel
  const topics = [
    { title: 'Tech', image: 'tech_image_url', id: 'tech' },
    { title: 'Lifestyle', image: 'lifestyle_image_url', id: 'lifestyle' },
    { title: 'Music', image: 'music_image_url', id: 'music' },
    // Add more topics as needed
  ];

  // Filter blogs based on search query
  useEffect(() => {
    if (searchQuery) {
      const results = userArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(results);
    } else {
      setFilteredArticles(userArticles);
    }
  }, [searchQuery, userArticles]);

  // Load recent activity
  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem('userActivity')) || [];
    setRecentActivity(activity);
  }, [user]);

  // Fetch top news articles
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

  // Load published articles
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('allArticles')) || [];
    const localWriterArticles = savedArticles.filter(
      (article) => article.status === 'published' && article.author !== user.name
    );
    setUserArticles(localWriterArticles);
  }, [user]);

  // Handle comment changes
  const handleCommentChange = (articleTitle, comment) => {
    const updatedComments = { ...comments, [articleTitle]: comment };
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  return (
    <div
      className={`p-6 min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}
    >
      <h1 className="text-4xl font-extrabold text-purple-400 mb-10">Welcome!</h1>

      {/* 🕒 Recent Activity */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">🕒 Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivity.length === 0 ? (
            <li className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No recent activity found.</li>
          ) : (
            recentActivity.map((activity) => (
              <li key={activity.title} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-900'}`}>
                <div className="flex justify-between">
                  <span>{activity.title}</span>
                  <span className="text-sm opacity-70">{activity.timestamp}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* 📝 Search Bar */}
      <div className="mb-12">
        <input
          type="text"
          className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          placeholder="Search for topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 🚀 Carousel Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">🌟 Explore Topics</h2>
        <Swiper spaceBetween={30} slidesPerView={1} loop={true} autoplay={{ delay: 2500 }}>
          {topics.map((topic) => (
            <SwiperSlide key={topic.id}>
              <div className="relative">
                <img src={topic.image} alt={topic.title} className="w-full h-72 object-cover rounded-lg shadow-lg" />
                <a href={`/blogs/${topic.id}`} className="absolute bottom-4 left-4 text-3xl font-bold text-white bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-400">
                  {topic.title}
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 📰 Blog Previews */}
      <div className="mb-14">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">📰 Latest Blogs</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.length === 0 ? (
            <p className="text-gray-400">No articles found.</p>
          ) : (
            filteredArticles.map((article) => (
              <li key={article.title} className={`p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border ${isDarkMode ? 'bg-gray-800 border-purple-800' : 'bg-white border-purple-300'}`}>
                <img src={article.image || 'https://via.placeholder.com/600x300?text=No+Image'} alt={article.title} className="w-full h-56 object-cover rounded-lg mb-4 shadow-md" />
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{article.content.slice(0, 100)}...</p>
                <button onClick={() => setSelectedArticle(article)} className="mt-2 text-purple-400 hover:text-purple-300 underline text-sm transition-colors duration-200">
                  Read More
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Short Site Description */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600">{`Welcome to our blog platform, where you can discover insightful articles across various topics and engage with the community!`}</p>
      </div>

      {/* Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
