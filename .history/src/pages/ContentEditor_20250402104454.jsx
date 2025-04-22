import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading, Code, List, Link, Save } from "lucide-react";
import  supabase  from "../supabase"; 
import { useNavigate } from "react-router-dom";

export default function ContentEditor() {
  const [title, setTitle] = useState(""); // Add a title input
  const [contentInput, setContentInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [saving, setSaving] = useState(false);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById("editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      contentInput.substring(0, start) + syntax + contentInput.substring(end);

    setContentInput(newText);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + syntax.length;
      textarea.focus();
    }, 10);
  };

  // Function to Save Article to Supabase
  const handleSave = async () => {
    if (!title.trim() || !contentInput.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("articles") // Ensure this matches your Supabase table
        .insert([{ title, content: contentInput }]);

      if (error) {
        console.error("Error saving article:", error);
        alert("Failed to save article! Check console for details.");
      } else {
        console.log("Article saved successfully:", data);
        alert("Article saved successfully!");
        setTitle("");
        setContentInput("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong! Check console.");
    } finally {
      setSaving(false);
    }
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

        {/* Toolbar */}
        <div className="mb-2 flex gap-2">
          <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={decreaseFontSize}>A-</button>
          <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={increaseFontSize}>A+</button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("**bold**")}><Bold size={18} /></button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("_italic_")}><Italic size={18} /></button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("# Heading\n")}><Heading size={18} /></button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("`code`")}><Code size={18} /></button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("- List Item\n")}><List size={18} /></button>
          <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("[Link](url)")}><Link size={18} /></button>
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
    </div>
  );
}
