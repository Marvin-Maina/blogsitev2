import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import ReactMarkdown from 'react-markdown';

export default function FullArticlePage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { title } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fallbackImage = '/default-article.png'; // Place this in your public folder

  // Load article
  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('allArticles')) || [];
    const found = articles.find((a) => a.title === title);
    if (found) {
      setArticle(found);
    } else {
      navigate('/user-dashboard');
    }
  }, [title, navigate]);

  // Load comments
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('articleComments')) || {};
    setComments(storedComments[title] || []);
  }, [title]);

  // Handle new comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Anon' };

    const updatedComments = [...comments, { user: user.name, text: newComment.trim() }];
    const allComments = JSON.parse(localStorage.getItem('articleComments')) || {};
    allComments[title] = updatedComments;
    localStorage.setItem('articleComments', JSON.stringify(allComments));
    setComments(updatedComments);
    setNewComment('');
  };

  if (!article) return <div className="p-6">Loading article...</div>;

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 prose prose-lg max-w-4xl mx-auto ${
        isDarkMode ? 'prose-invert bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-purple-400">{article.title}</h1>
      <img
        src={article.image || fallbackImage}
        alt={article.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />
      <ReactMarkdown>{article.content}</ReactMarkdown>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl shadow-sm ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="font-semibold text-purple-400">{c.user}</p>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to drop one 👇</p>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            className={`w-full p-3 rounded-xl border ${
              isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
            }`}
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-xl"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
