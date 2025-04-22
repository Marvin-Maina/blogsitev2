import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import ReactMarkdown from 'react-markdown';

export default function FullArticlePage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { title } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('allArticles')) || [];
    const found = articles.find((a) => a.title === title);
    if (found) {
      setArticle(found);
    } else {
      navigate('/user-dashboard'); // fallback if article not found
    }
  }, [title, navigate]);

  if (!article) {
    return <div className="p-6">Loading article...</div>;
  }

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 prose prose-lg max-w-4xl mx-auto ${
        isDarkMode ? 'prose-invert bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-purple-400">{article.title}</h1>
      <img
        src={article.image || 'https://via.placeholder.com/600x300?text=No+Image'}
        alt={article.title}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </div>
  );
}
