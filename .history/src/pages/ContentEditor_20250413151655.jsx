import { useState, useContext } from "react";
import { Save } from "lucide-react";
import { ThemeContext } from "../ThemeContext";
import { useAuth } from "./Authprovider";

export default function ContentEditor() {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth(); // Access user from context

  const [title, setTitle] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [status, setStatus] = useState("draft");  // Default to 'draft'
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);

    // Create article object
    const articleData = {
      title,
      content: contentInput,
      createdAt: new Date().toISOString(),
      status,
      author: user?.name || "Anonymous",
      authorId: user?.id || null,
    };

    // Get existing articles from localStorage
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];

    // Add the new article (draft)
    savedArticles.push(articleData);

    // Save the updated articles to localStorage
    localStorage.setItem("articles", JSON.stringify(savedArticles));

    // Reset the form
    setSaving(false);
    setTitle("");
    setContentInput("");
    setStatus("draft");  // Reset status to 'draft' after saving
  };

  const handlePublish = () => {
    setSaving(true);

    // Create article object
    const articleData = {
      title,
      content: contentInput,
      createdAt: new Date().toISOString(),
      status: "published",  // Change status to 'published'
      author: user?.name || "Anonymous",
      authorId: user?.id || null,
    };

    // Get existing articles from localStorage
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];

    // Add the new article (published)
    savedArticles.push(articleData);

    // Save the updated articles to localStorage
    localStorage.setItem("articles", JSON.stringify(savedArticles));

    // Add the article to the User Dashboard (localStorage or another state)
    const userArticles = JSON.parse(localStorage.getItem("userArticles")) || [];
    userArticles.push(articleData);

    // Save published articles to localStorage for User Dashboard
    localStorage.setItem("userArticles", JSON.stringify(userArticles));

    // Reset the form
    setSaving(false);
    setTitle("");
    setContentInput("");
    setStatus("draft");  // Reset status to 'draft' after saving
  };

  return (
    <div className={`p-6 min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="flex flex-col md:flex-row h-screen p-6 ml-20">
        {/* Editor Panel */}
        <div className="w-full md:w-1/2 p-4 border">
          <h1 className="text-2xl font-bold mb-4">CONTENT</h1>

          <input
            type="text"
            placeholder="Enter article title..."
            className="w-full p-2 mb-3 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Article Status */}
          <div className="mb-3">
            <label>Status: </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <textarea
            className="w-full h-96 p-4 rounded-lg"
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="Write your article here..."
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-500 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
            <Save size={18} />
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish Article"}
            <Save size={18} />
          </button>
        </div>

        {/* Preview Panel */}
        <div className="w-full md:w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-4">PREVIEW</h1>
          <div className="p-4 rounded-lg overflow-auto h-96 bg-gray-100">
            <div>{contentInput}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
