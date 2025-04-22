import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { ThemeContext } from '../ThemeContext';

const ArticleModal = ({ article, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const getTextOnlyPreview = (markdown) => {
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // remove image markdown
      .replace(/\[.*?\]\(.*?\)/g, "") // remove links
      .replace(/[*_~#`>]/g, "") // remove formatting chars
      .replace(/<\/?[^>]+(>|$)/g, "") // remove HTML tags
      .slice(0, 150)
      .trim() + "...";
  };

  const getImageUrl = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    return 'https://via.placeholder.com/600x300?text=No+Image';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh] ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X size={24} />
        </button>

        {/* Article Content */}
        <img
                  src={article.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                  alt={article.title}
                  className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
                />

        <h2 className="text-3xl font-bold mb-2">{article.title}</h2>

        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {getTextOnlyPreview(article.content)}
                </p>
      </div>
    </div>
  );
};

export default ArticleModal;
