import { useEffect, useState } from "react";
import fetchBlogs from "../fetchBlogs";
import { useAuth } from "../pages/Authprovider"; 

const Bloglist = () => {
  const [blogs, setBlogs] = useState([]);
  const { user, role, loading } = useAuth(); // Get user & role

  useEffect(() => {
    const getBlogs = async () => {
      if (!role) return; // Don't fetch unless role is available
      const articles = await fetchBlogs("mu");
      setBlogs(articles);
    };
    getBlogs();
  }, [role]);

  if (loading) return <p className="text-gray-400">Loading user role...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400">Latest Blogs</h2>

      {blogs.length > 0 ? (
        blogs.map((blog, index) => (
          <div
            key={index}
            className="p-5 mb-6 bg-gray-800 rounded-lg shadow-md flex gap-6 transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-gray-700"
          >
            {blog.urlToImage && (
              <img
                src={blog.urlToImage}
                alt={blog.title}
                className="w-36 h-36 object-cover rounded-lg shadow-md border border-gray-700 transition-transform duration-300 ease-in-out hover:scale-105"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-indigo-300">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                {blog.description}
              </p>
              <a
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-indigo-400 hover:underline transition-all duration-300 ease-in-out hover:text-indigo-300"
              >
                Read more →
              </a>

              {/* Show Edit & Delete only for Admins & Editors */}
              {(role === "admin" || role === "editor") && (
                <div className="mt-4 flex gap-4">
                  <button className="text-yellow-400 hover:text-yellow-500">
                    Edit ✏️
                  </button>
                  <button className="text-red-400 hover:text-red-500">
                    Delete 🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">Blogs loading...</p>
      )}
    </div>
  );
};

export default Bloglist;
