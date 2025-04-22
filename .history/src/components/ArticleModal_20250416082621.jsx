import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react'; // Import the exit icon from lucide-react

const ArticleModal = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{article.title}</h2>
          <button onClick={onClose} className="text-gray-600 dark:text-white hover:text-gray-900">
            <X size={24} />
          </button>
        </div>
        <div className="mt-4">
          <div className="prose dark:prose-invert">
            {/* Render the article content as markdown */}
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
