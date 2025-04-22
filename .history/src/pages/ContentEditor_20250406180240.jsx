import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bold, Italic, Heading, Code, List, Link, Save } from "lucide-react";
import supabase from "../supabase"; 
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
    const selectedText = contentInput.substring(start, end);

    // If there's selected text, wrap it with the syntax
    if (selectedText) {
      const newText =
        contentInput.substring(0, start) +
        syntax +
        selectedText +
        syntax +
        contentInput.substring(end);
      setContentInput(newText);

      // After inserting the syntax, reset the cursor position to just after the closing syntax
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + syntax.length + selectedText.length + syntax.length;
        textarea.focus();
      }, 10);
    } else {
      // If no text is selected, just insert the syntax at the cursor position
      const newText =
        contentInput.substring(0, start) + syntax + contentInput.substring(end);
      setContentInput(newText);

      // After inserting the syntax, reset the cursor position to just after the inserted syntax
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + syntax.length;
        textarea.focus();
      }, 10);
    }
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
      <div className="w-full
