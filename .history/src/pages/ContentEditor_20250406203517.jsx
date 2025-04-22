import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Heading,
  Code,
  List,
  Link as LinkIcon,
  Save,
  ImagePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MediaPicker from "./MediaPicker";

export default function ContentEditor() {
  const [title, setTitle] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [saving, setSaving] = useState(false);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const storedMedia = JSON.parse(localStorage.getItem("media")) || [];
    setMediaList(storedMedia);
  }, []);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById("editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = contentInput.substring(start, end);

    let newText;

    if (selectedText) {
      newText =
        contentInput.substring(0, start) +
        syntax +
        selectedText +
        syntax +
        contentInput.substring(end);
    } else {
      newText =
        contentInput.substring(0, start) + syntax + contentInput.substring(end);
    }

    setContentInput(newText);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + syntax.length + (selectedText ? selectedText.length : 0);
      textarea.focus();
    }, 10);
  };

  const insertImage = (url) => {
    const markdownImage = `![Alt text](${url})\n`;
    setContentInput((prev) => prev + markdownImage);
  };

  const handleSave = () => {
    if (!title.trim() || !contentInput.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    setSaving(true);
    const savedArticles =
      JSON.parse(localStorage.getItem("articles")) || [];

    const newArticle = {
      id: Date.now(),
      title,
      content: contentInput,
    };

    localStorage.setItem(
      "articles",
      JSON.stringify([...savedArticles, newArticle])
    );

    alert("Article saved to localStorage!");
    setTitle("");
    setContentInput("");
    setSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 p-6 ml-20">
      {/* Editor Panel */}
      <div className="w-full md:w-1/2 p-4 border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-gray-400">CONTENT</h1>

        <input
          type="text"
          placeholder="Enter article title..."
          className="w-full p-2 mb-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Toolbar */}
        <div className="mb-2 flex gap-2 flex-wrap">
          <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={decreaseFontSize}>A-</button>
          <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={increaseFontSize}>A+</button>
          <button className="bg-gray-700 p-2 rounded" onClick={() => insertMarkdown("**")}><Bold size={18} /></button>
          <button className="bg-gray-700 p-2 rounded" onClick={() => insertMarkdown("_")}><Italic size={18} /></button>
          <button className="bg-gray-700 p-2 rounded" onClick={() => insertMarkdown("# ")}><Heading size={18} /></button>
          <button className="bg-gray-700 p-2 rounded" onClick={() => insertMarkdown("`")}><Code size={18} /></button>
          <button className="bg-gray-700 p-2 rounded" onClick={() => insertMarkdown("- ")}><List size={18} /></button>
          <button className="bg-gray-700 p-2 rounded" onClick={() => insertMarkdown("[Link](url)")}>
            <LinkIcon size={18} />
          </button>

          {/* Media Picker Dropdown */}
          <div className="relative group">
            <button className="bg-gray-700 p-2 rounded flex items-center gap-1">
              <ImagePlus size={18} />
              <span className="text-sm hidden md:inline">Media</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg hidden group-hover:block z-10 max-h-64 overflow-y-auto">
              {mediaList.length === 0 ? (
                <div className="p-2 text-xs text-gray-400 text-center">No media uploaded yet</div>
              ) : (
                mediaList.map((media, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-gray-700 p-2 text-xs"
                    onClick={() => insertImage(media.url)}
                  >
                    <img src={media.url} alt="media" className="h-12 w-full object-cover rounded" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <textarea
          id="editor"
          className="w-full h-96 p-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg"
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
        <h1 className="text-2xl font-bold mb-4 text-gray-400">PREVIEW</h1>
        <div
          className="p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto h-96"
          style={{ fontSize: `${fontSize}px` }}
        >
          <ReactMarkdown>{contentInput}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
