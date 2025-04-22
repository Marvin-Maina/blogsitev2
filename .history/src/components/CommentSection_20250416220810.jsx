// src/components/CommentSection.jsx
import { useEffect, useState } from 'react';

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('comments')) || {};
    setComments(storedComments[articleId] || []);
  }, [articleId]);

  const handleAddComment = () => {
    if (!text.trim()) return;

    const newComment = {
      user: currentUser?.name || 'Anonymous',
      text,
      timestamp: new Date().toISOString(),
    };

    const storedComments = JSON.parse(localStorage.getItem('comments')) || {};
    const articleComments = storedComments[articleId] || [];

    const updatedComments = [...articleComments, newComment];
    storedComments[articleId] = updatedComments;

    localStorage.setItem('comments', JSON.stringify(storedComments));
    setComments(updatedComments);
    setText('');
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-violet-400 mb-2">Comments</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="bg-zinc-800 p-2 rounded-lg border border-zinc-700"
          >
            <p className="text-xs text-gray-300">{comment.user}:</p>
            <p className="text-sm text-gray-200">{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">Be the first to comment 🤘</p>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-zinc-700 text-white text-sm px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Add your thoughts..."
        />
        <button
          onClick={handleAddComment}
          className="bg-violet-600 hover:bg-violet-700 px-3 py-1 text-sm rounded-lg text-white"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
