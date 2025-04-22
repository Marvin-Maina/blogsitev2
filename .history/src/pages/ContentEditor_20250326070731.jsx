import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Heading, Code, List, Link } from "lucide-react";

export default function ContentEditor() {
    const [contentInput, setContentInput] = useState("");
    const [fontSize, setFontSize] = useState(16);

    const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32));
    const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

    const insertMarkdown = (syntax, wrap = false) => {
        const textarea = document.getElementById("editor");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = contentInput.substring(start, end);

        let newText;
        if (wrap && selectedText) {
            newText =
                contentInput.substring(0, start) +
                syntax + selectedText + syntax +
                contentInput.substring(end);
        } else {
            newText =
                contentInput.substring(0, start) +
                syntax +
                contentInput.substring(end);
        }

        setContentInput(newText);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + syntax.length;
            textarea.focus();
        }, 10);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 p-6 ml-20">
            {/* Editor Section */}
            <div className="w-full md:w-1/2 p-4 border border-gray-700">
                <h1 className="text-2xl font-bold mb-4 text-gray-400">CONTENT</h1>

                <div className="mb-2 flex gap-2">
                    <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={decreaseFontSize}>A-</button>
                    <button className="bg-gray-700 px-3 py-1 rounded text-sm" onClick={increaseFontSize}>A+</button>
                    <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("**", true)}><Bold size={18} /></button> 
                    <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("_", true)}><Italic size={18} /></button> 
                    <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("# ", false)}><Heading size={18} /></button> 
                    <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("`", true)}><Code size={18} /></button> 
                    <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("- ", false)}><List size={18} /></button> 
                    <button className="bg-gray-700 p-2 rounded text-sm" onClick={() => insertMarkdown("[Link](url)", false)}><Link size={18} /></button> 
                </div>

                <textarea
                    id="editor"
                    autoFocus
                    className="w-full h-96 p-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Write article here...."
                ></textarea>
            </div>

            {/* Preview Section */}
            <div className="w-full md:w-1/2 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-400">PREVIEW</h1>
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto h-96 text-gray-300" style={{ fontSize: `${fontSize}px` }}>
                    <ReactMarkdown>{contentInput}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
