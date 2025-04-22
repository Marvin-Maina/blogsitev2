import React from 'react';
import { X } from 'lucide-react'; // Import close icon from lucide-react
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import ReactMarkdown from 'react-markdown'; // We need this for rendering markdown content

const ArticleModal = ({ article, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  // Function to handle image URL and fallback
  const getImageUrl = (imageUrl) => {
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
      return imageUrl;
    }
    return 'https://via.placeholder.com/600x300?text=No+Image';
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isDarkMode ? 'bg-black bg-opacity-70' : 'bg-white bg-opacity-50'
      } backdrop-blur-sm`} // Apply blur to background instead of blackout
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}
        >
          <X /> {/* Use the exit icon from lucide-react */}
        </button>
        <div className="flex flex-col">
          <img
            src={getImageUrl(article.image)}
            alt={article.title}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
          <h2 className="text-3xl font-bold mb-2">{article.title}</h2>

          {/* Render markdown content */}
          <ReactMarkdown className="text-lg mb-4">{article.content}</ReactMarkdown>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-purple-500 hover:text-purple-400 underline text-sm`}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
