import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading, Code, List, Link, Save, Image } from "lucide-react"; // Add Image icon
import MediaPicker from "./MediaPicker";  // Import the MediaPicker component
 const { isDarkMode } = useContext(ThemeContext)
export default function ContentEditor() {
  const [title, setTitle] = useState(""); 
  const [contentInput, setContentInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [saving, setSaving] = useState(false);
  const [isMediaPickerOpen, setMediaPickerOpen] = useState(false); // State to control the MediaPicker visibility
  const [status, setStatus] = useState("published"); // New state for article status

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById("editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = contentInput.substring(start, end);

    if (selectedText) {
      const newText =
        contentInput.substring(0, start) +
        syntax +
        selectedText +
        syntax +
        contentInput.substring(end);
      setContentInput(newText);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + syntax.length + selectedText.length + syntax.length;
        textarea.focus();
      }, 10);
    } else {
      const newText =
        contentInput.substring(0, start) + syntax + contentInput.substring(end);
      setContentInput(newText);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + syntax.length;
        textarea.focus();
      }, 10);
    }
  };

  // Open MediaPicker
  const handleMediaPickerOpen = () => {
    setMediaPickerOpen(true);
  };

  // Close MediaPicker
  const handleMediaPickerClose = () => {
    setMediaPickerOpen(false);
  };

  // Insert image from MediaPicker into the content
  const handleImageSelect = (imageUrl) => {
    insertMarkdown(`![image](${imageUrl})`);
  };

  // Define the handleSave function
  const handleSave = () => {
    setSaving(true);

    // Create the article object with the selected status
    const articleData = {
      title,
      content: contentInput,
      createdAt: new Date().toISOString(),
      status, // Include status when saving the article
    };

    // Retrieve existing articles from localStorage (if any)
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];

    // Append the new article to the list
    savedArticles.push(articleData);

    // Save the updated list of articles to localStorage
    localStorage.setItem("articles", JSON.stringify(savedArticles));

    setSaving(false);

    // Optionally reset the fields
    setTitle("");
    setContentInput("");
    setStatus("published"); // Reset status to "published" after saving
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 p-6 ml-20">
      {/* Editor Panel */}
      <div className="w-full md:w-1/2 p-4 border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-gray-400">CONTENT</h1>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter article title..."
          className="w-full p-2 mb-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Status Toggle */}
        <div className="mb-3 flex gap-3">
          <label className="text-gray-400">Status: </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Toolbar */}
        <div className="mb-2 flex gap-2">
          <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={decreaseFontSize}>A-</button>
          <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={increaseFontSize}>A+</button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("**")}>
            <Bold size={18} />
          </button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("_")}>
            <Italic size={18} />
          </button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("# Heading\n")}>
            <Heading size={18} />
          </button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("`code`")}>
            <Code size={18} />
          </button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("- List Item\n")}>
            <List size={18} />
          </button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("[Link](url)")}>
            <Link size={18} />
          </button>
          {/* Open the media picker */}
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={handleMediaPickerOpen}>
            <Image size={18} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          id="editor"
          autoFocus
          className="w-full h-96 p-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          placeholder="Write article here..."
        ></textarea>

        {/* Save Button */}
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
        <h1 className="text-2xl font-bold mb-4 text-gray-400">PREVIEW</h1>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto h-96">
          <ReactMarkdown
            style={{ fontSize: `${fontSize}px` }}
            components={{
              p: ({ node, ...props }) => <p className="text-gray-300" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-gray-400 text-2xl font-bold" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-gray-400 text-xl font-bold" {...props} />,
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="bg-gray-700 p-1 rounded text-gray-300" {...props} />
                ) : (
                  <pre className="bg-gray-800 p-2 rounded-lg overflow-auto" {...props} />
                ),
            }}
          >
            {contentInput}
          </ReactMarkdown>
        </div>
      </div>

      {/* Conditionally render MediaPicker */}
      {isMediaPickerOpen && (
        <MediaPicker onSelect={handleImageSelect} onClose={handleMediaPickerClose} />
      )}
    </div>
  );
}
