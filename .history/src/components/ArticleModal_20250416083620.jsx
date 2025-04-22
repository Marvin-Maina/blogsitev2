import React from 'react';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import ReactMarkdown from 'react-markdown';

const ArticleModal = ({ article, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const getImageUrl = (imageUrl) => {
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
      return imageUrl;
    }
    return 'https://via.placeholder.com/600x300?text=No+Image';
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
        isDarkMode ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-20'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh] ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500`}
        >
          <X />
        </button>

        <div className="flex flex-col">
          <img
            src={getImageUrl(article.image)}
            alt={article.title}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
          <h2 className="text-3xl font-bold mb-4">{article.title}</h2>

          {/* 👇 Wrap markdown content with Tailwind Typography */}
          <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
