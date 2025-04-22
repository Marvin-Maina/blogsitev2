import { useState, useContext, useEffect } from "react";
import { Save } from "lucide-react";
import { ThemeContext } from "../ThemeContext";
import { useAuth } from "./Authprovider";
import { FaBold, FaItalic, FaUnderline, FaImage } from "react-icons/fa";
import { useRef } from "react";

export default function ContentEditor() {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false); // State to toggle media library modal
  const [mediaFiles, setMediaFiles] = useState(() => {
    const stored = localStorage.getItem("mediaFiles");
    return stored ? JSON.parse(stored) : [];
  });
  
  const contentInputRef = useRef(null);

  const saveArticle = (articleStatus) => {
    setSaving(true);

    if (!title.trim() || !contentInput.trim()) {
      alert("Title and content cannot be empty!");
      setSaving(false);
      return;
    }

    const articleData = {
      title,
      content: contentInput,
      createdAt: new Date().toISOString(),
      status: articleStatus,
      author: user?.name || "Anonymous",
      authorId: user?.id || null,
    };

    const allArticles = JSON.parse(localStorage.getItem("allArticles")) || [];
    allArticles.push(articleData);
    localStorage.setItem("allArticles", JSON.stringify(allArticles));

    setSaving(false);
    setTitle("");
    setContentInput("");
    setStatus("draft");
  };

  const handleSave = () => saveArticle("draft");
  const handlePublish = () => saveArticle("published");

  // Insert at cursor in the content editor
  const insertAtCursor = (textToInsert) => {
    const textarea = contentInputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = contentInput.substring(0, start);
    const after = contentInput.substring(end);
    setContentInput(before + textToInsert + after);
  };

  const light = {
    bg: "bg-white",
    text: "text-gray-900",
    subText: "text-gray-600",
    border: "border-gray-300",
    input: "bg-white text-gray-800 border-gray-300",
    toolbar: "bg-gray-100",
    preview: "bg-gray-100",
    heading: "text-gray-800",
  };

  const dark = {
    bg: "bg-gray-950",
    text: "text-white",
    subText: "text-gray-400",
    border: "border-gray-700",
    input: "bg-gray-800 text-gray-300 border-gray-700",
    toolbar: "bg-gray-700",
    preview: "bg-gray-800",
    heading: "text-gray-400",
  };

  const theme = isDarkMode ? dark : light;

  return (
    <div className={`p-6 min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <div className="flex flex-col md:flex-row h-screen p-6 ml-20">
        {/* Editor Panel */}
        <div className={`w-full md:w-1/2 p-4 ${theme.border} border`}>
          <h1 className={`text-2xl font-bold mb-4 ${theme.heading}`}>CONTENT</h1>

          <input
            type="text"
            placeholder="Enter article title..."
            className={`w-full p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 ${theme.input} focus:ring-blue-500`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mb-3">
            <label className={theme.subText}>Status: </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`p-2 rounded-lg ${theme.input}`}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Toolbar */}
          <div className={`flex gap-4 p-2 mb-2 rounded ${theme.toolbar}`}>
            <button onClick={() => insertAtCursor("**bold text**")} title="Bold"><FaBold /></button>
            <button onClick={() => insertAtCursor("*italic text*")} title="Italic"><FaItalic /></button>
            <button onClick={() => insertAtCursor("<u>underline text</u>")} title="Underline"><FaUnderline /></button>
            <button onClick={() => setShowMediaLibrary(true)} title="Insert Image"><FaImage /></button>
          </div>

          {/* Editor Textarea */}
          <textarea
            ref={contentInputRef}
            className={`w-full h-96 p-4 rounded-lg focus:outline-none focus:ring-2 ${theme.input} focus:ring-blue-500`}
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="Write your article here..."
          />

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-500 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
            <Save size={18} />
          </button>

          <button
            onClick={handlePublish}
            className="mt-4 ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish Article"}
            <Save size={18} />
          </button>
        </div>

        {/* Preview Panel */}
        <div className="w-full md:w-1/2 p-4">
          <h1 className={`text-2xl font-bold mb-4 ${theme.heading}`}>PREVIEW</h1>
          <div
            className={`p-4 rounded-lg overflow-auto h-96 ${theme.preview} ${theme.border} border`}
            dangerouslySetInnerHTML={{
              __html: contentInput
                .replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" alt="Embedded Image" class="max-w-full h-auto my-2 rounded" />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>'),
            }}
          />
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Select Image</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaFiles.map((file, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg shadow cursor-pointer"
                  onClick={() => {
                    insertAtCursor(`![${file.name}](${file.url})`); // Insert image into editor
                    setShowMediaLibrary(false); // Close the modal
                  }}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="mt-2 text-sm text-center">{file.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMediaLibrary(false)}
              className="mt-4 text-red-600 hover:text-red-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
