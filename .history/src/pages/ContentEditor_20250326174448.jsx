import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "../supabaseClient"; 
import { useNavigate, useParams } from "react-router-dom"; 

export default function ContentEditor() {
    const { articleId } = useParams(); // Get the article ID from URL (if editing)
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("");
    const [contentInput, setContentInput] = useState("");

    useEffect(() => {
        if (articleId) fetchArticle();
    }, [articleId]);

    // Fetch an existing article if editing
    const fetchArticle = async () => {
        const { data, error } = await supabase
            .from("articles")
            .select("title, content")
            .eq("id", articleId)
            .single();

        if (error) console.error("Error fetching article:", error);
        else {
            setTitle(data.title);
            setContentInput(data.content);
        }
    };

    // Save the article (either create new or update existing)
    const handleSave = async () => {
        if (!title.trim() || !contentInput.trim()) {
            alert("Title and content cannot be empty!");
            return;
        }

        if (articleId) {
            // Update existing article
            const { error } = await supabase
                .from("articles")
                .update({ title, content: contentInput })
                .eq("id", articleId);

            if (error) console.error("Error updating article:", error);
        } else {
            // Insert new article
            const { error } = await supabase
                .from("articles")
                .insert([{ title, content: contentInput }]);

            if (error) console.error("Error adding article:", error);
        }

        navigate("/dashboard"); // Redirect back to the dashboard
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{articleId ? "Edit Article" : "New Article"}</h1>

            <label className="block mb-2 font-semibold">Title</label>
            <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
            />

            <label className="block mb-2 font-semibold">Content</label>
            <textarea
                className="w-full h-96 p-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg"
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                placeholder="Write article here..."
            ></textarea>

            {/* Preview */}
            <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
                <h2 className="text-xl font-bold mb-2">Preview</h2>
                <ReactMarkdown>{contentInput}</ReactMarkdown>
            </div>

            {/* Save Button */}
            <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
            >
                Save Article
            </button>
        </div>
    );
}
