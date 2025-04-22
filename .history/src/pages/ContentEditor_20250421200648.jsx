import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function ContentEditor({ onSave }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Load media files from localStorage
  useEffect(() => {
    const storedMedia = localStorage.getItem("mediaFiles");
    if (storedMedia) {
      setMediaFiles(JSON.parse(storedMedia));
    }
  }, []);

  const handleSave = () => {
    const article = {
      title,
      content,
      status,
      createdAt: new Date().toISOString(),
    };
    onSave(article);
    setTitle("");
    setContent("");
    setStatus("draft");
  };

  const insertAtCursor = (text) => {
    const textarea = document.getElementById("markdown-textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-8 rounded-2xl border shadow-xl ${isDarkMode ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
      <h2 className="text-3xl font-bold mb-6 font-mono tracking-wider">📝 New Article</h2>

      <Input
        className="mb-4 text-lg font-semibold px-4 py-3 rounded-xl"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={() => setShowMediaLibrary(true)}>
          📸 Media
        </Button>
        <Button variant="ghost" onClick={() => insertAtCursor("**bold text**")}>
          🔡 Bold
        </Button>
        <Button variant="ghost" onClick={() => insertAtCursor("*italic text*")}>
          🔤 Italic
        </Button>
      </div>

      <Textarea
        id="markdown-textarea"
        className="h-64 mb-4 p-4 text-sm font-mono leading-relaxed rounded-xl"
        placeholder="Write your content in Markdown here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-between items-center mb-6">
        <select
          className="px-4 py-2 rounded-md border focus:outline-none font-medium"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <Button className="px-6 py-2 font-semibold rounded-xl" onClick={handleSave}>
          💾 Save
        </Button>
      </div>

      {/* Grunge-Styled Media Picker Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center transition-opacity duration-300">
          <div className={`w-[90%] max-w-3xl p-6 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}>
            <h2 className="text-3xl font-bold mb-4 font-mono tracking-wider">📂 Media Library</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto">
              {mediaFiles.map((file, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-xl shadow hover:shadow-md transition-transform hover:scale-105 cursor-pointer border-2 ${isDarkMode ? 'border-gray-700 hover:border-violet-500' : 'border-gray-300 hover:border-violet-600'}`}
                  onClick={() => {
                    insertAtCursor(`![${file.name}](${file.url})`);
                    setShowMediaLibrary(false);
                  }}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-xs text-center font-semibold">{file.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMediaLibrary(false)}
              className="mt-6 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
