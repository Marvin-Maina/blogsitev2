import { useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading, Code, List, Link, Save, Image } from "lucide-react";
import MediaPicker from "./MediaPicker";
import { ThemeContext } from '../ThemeContext';
import { useAuth } from "./Authprovider";


export default function ContentEditor() {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext); // <-- Grab user from context

  const [title, setTitle] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [saving, setSaving] = useState(false);
  const [isMediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [status, setStatus] = useState("published");

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById("editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = contentInput.substring(start, end);

    const newText = selectedText
      ? contentInput.substring(0, start) + syntax + selectedText + syntax + contentInput.substring(end)
      : contentInput.substring(0, start) + syntax + contentInput.substring(end);

    setContentInput(newText);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + syntax.length + (selectedText?.length || 0);
      textarea.focus();
    }, 10);
  };

  const handleMediaPickerOpen = () => setMediaPickerOpen(true);
  const handleMediaPickerClose = () => setMediaPickerOpen(false);
  const handleImageSelect = (imageUrl) => insertMarkdown(`![image](${imageUrl})`);

  const handleSave = () => {
    setSaving(true);
    const articleData = {
      title,
      content: contentInput,
      createdAt: new Date().toISOString(),
      status,
      author: user?.name || "Anonymous",
      authorId: user?.id || null,
    };
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    savedArticles.push(articleData);
    localStorage.setItem("articles", JSON.stringify(savedArticles));
    setSaving(false);
    setTitle("");
    setContentInput("");
    setStatus("published");
  };

  const light = {
    bg: "bg-white",
    text: "text-gray-900",
    subText: "text-gray-600",
    border: "border-gray-300",
    input: "bg-white text-gray-800 border-gray-300",
    toolbar: "bg-gray-100",
    preview: "bg-gray-100",
    heading: "text-gray-800"
  };

  const dark = {
    bg: "bg-gray-950",
    text: "text-white",
    subText: "text-gray-400",
    border: "border-gray-700",
    input: "bg-gray-800 text-gray-300 border-gray-700",
    toolbar: "bg-gray-700",
    preview: "bg-gray-800",
    heading: "text-gray-400"
  };

  const theme = isDarkMode ? dark : light;

  return (
    <div className={`p-6 min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <div className={`flex flex-col md:flex-row h-screen ${theme.bg} ${theme.text} p-6 ml-20`}>

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

          <div className="mb-3 flex gap-3">
            <label className={theme.subText}>Status: </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`rounded-lg p-2 ${theme.input}`}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="mb-2 flex gap-2 flex-wrap">
            <button className={`${theme.toolbar} px-3 py-1 rounded text-sm`} onClick={decreaseFontSize}>A-</button>
            <button className={`${theme.toolbar} px-3 py-1 rounded text-sm`} onClick={increaseFontSize}>A+</button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={() => insertMarkdown("**")}><Bold size={18} /></button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={() => insertMarkdown("_")}><Italic size={18} /></button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={() => insertMarkdown("# Heading\n")}><Heading size={18} /></button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={() => insertMarkdown("`code`")}><Code size={18} /></button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={() => insertMarkdown("- List Item\n")}><List size={18} /></button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={() => insertMarkdown("[Link](url)")}><Link size={18} /></button>
            <button className={`${theme.toolbar} p-2 rounded`} onClick={handleMediaPickerOpen}><Image size={18} /></button>
          </div>

          <textarea
            id="editor"
            autoFocus
            className={`w-full h-96 p-4 rounded-lg focus:outline-none focus:ring-2 ${theme.input} focus:ring-blue-500`}
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="Write article here..."
          ></textarea>

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Article"}
            <Save size={18} />
          </button>
        </div>

        {/* Preview Panel */}
        <div className="w-full md:w-1/2 p-4">
          <h1 className={`text-2xl font-bold mb-4 ${theme.heading}`}>PREVIEW</h1>
          <div className={`p-4 rounded-lg overflow-auto h-96 ${theme.preview} ${theme.border} border`}>
            <ReactMarkdown
              style={{ fontSize: `${fontSize}px` }}
              components={{
                p: ({ node, ...props }) => <p className={theme.subText} {...props} />,
                h1: ({ node, ...props }) => <h1 className={`text-2xl font-bold ${theme.heading}`} {...props} />,
                h2: ({ node, ...props }) => <h2 className={`text-xl font-bold ${theme.heading}`} {...props} />,
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className={`p-1 rounded ${theme.toolbar}`} {...props} />
                  ) : (
                    <pre className={`p-2 rounded-lg overflow-auto ${theme.input}`} {...props} />
                  ),
              }}
            >
              {contentInput}
            </ReactMarkdown>
          </div>
        </div>

        {isMediaPickerOpen && (
          <MediaPicker onSelect={handleImageSelect} onClose={handleMediaPickerClose} />
        )}
      </div>
    </div>
  );
}
