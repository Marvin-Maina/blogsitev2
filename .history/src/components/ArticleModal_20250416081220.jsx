
import React from 'react';
i
const ArticleModal = ({ article, onClose, isDarkMode }) => {
  if (!article) return null;
  const getTextOnlyPreview = (markdown) => {
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // remove image markdown
      .replace(/\[.*?\]\(.*?\)/g, "") // remove links
      .replace(/[*_~#`>]/g, "") // remove formatting chars
      .replace(/<\/?[^>]+(>|$)/g, "") // remove HTML tags
      .slice(0, 150)
      .trim() + "...";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 pt-16">
      <div className={`w-[90%] max-w-3xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[80vh]`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl font-bold text-red-500 hover:text-red-400"
        >
          ×
        </button>
        <img
          src={article.image || 'https://via.placeholder.com/600x300?text=No+Image'}
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {getTextOnlyPreview(article.content)}
                </p>
      </div>
    </div>
  );
};

export default ArticleModal;
