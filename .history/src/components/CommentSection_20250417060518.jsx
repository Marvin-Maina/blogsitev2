import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { useAuth } from '../pages/Authprovider';

export default function CommentSection({ articleId }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const commentsKey = `comments-${articleId}`;

  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    setComments(savedComments);
  }, [commentsKey]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    const newComment = {
      name: user?.name || 'Anonymous',
      text: commentText,
      timestamp: new Date().toLocaleString(),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(commentsKey, JSON.stringify(updatedComments));
    setCommentText('');
  };

  return (
    <div className={`mt-4 p-4 rounded-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
    }`}>
      <h3 className="text-lg font-semibold mb-2 text-purple-400">💬 Comments</h3>

      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Leave a comment..."
          className={`w-full p-3 rounded-md border resize-none focus:outline-none focus:ring-2 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-600'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
          }`}
          rows="3"
        />
        <button
          type="submit"
          className="mt-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Post
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="italic text-sm text-gray-400">No comments yet. Be the first to add one!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className={`p-3 rounded-md shadow-sm border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className="font-semibold text-purple-400">{comment.name}</p>
              <p className="text-sm mb-1">{comment.text}</p>
              <p className="text-xs text-gray-400">{comment.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
