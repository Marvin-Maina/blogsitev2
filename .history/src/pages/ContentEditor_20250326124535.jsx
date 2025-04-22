import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import  from "../supabase";
import { Bold, Italic, Heading, Code, List, Link, Image } from "lucide-react";

export default function ContentEditor() {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [contentInput, setContentInput] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchArticles();
        fetchImages();

        // Listen for real-time article updates
        const subscription = supabase
            .channel("articles")
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "articles" }, (payload) => {
                if (selectedArticle && payload.new.id === selectedArticle.id) {
                    setContentInput(payload.new.content);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [selectedArticle]);

    const fetchArticles = async () => {
        const { data, error } = await supabase.from("articles").select("*");
        if (!error) setArticles(data);
    };

    const fetchImages = async () => {
        const { data } = await supabase.storage.from("article-images").list();
        if (data) {
            setUploadedImages(data.map((file) => ({
                id: file.name,
                publicUrl: supabase.storage.from("article-images").getPublicUrl(file.name).publicUrl
            })));
        }
    };

    const handleSelectArticle = (article) => {
        setSelectedArticle(article);
        setTitle(article.title);
        setCategory(article.category);
        setContentInput(article.content);
    };

    const handleSaveArticle = async () => {
        if (!title.trim() || !category.trim() || !contentInput.trim()) {
            alert("Title, category, and content are required!");
            return;
        }

        setSaving(true);
        let response;
        if (selectedArticle) {
            response = await supabase
                .from("articles")
                .update({ title, category, content: contentInput })
                .eq("id", selectedArticle.id);
        } else {
            response = await supabase.from("articles").insert([{ title, category, content: contentInput }]);
        }

        setSaving(false);
        if (!response.error) fetchArticles();
    };

    // Handle Drag & Drop Image Upload
    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file) return;

        setUploading(true);
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage.from("article-images").upload(fileName, file);
        if (error) {
            alert("Failed to upload image.");
            setUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage.from("article-images").getPublicUrl(fileName);
        setUploadedImages((prev) => [...prev, { id: fileName, publicUrl: urlData.publicUrl }]);
        insertImageMarkdown(urlData.publicUrl);
        setUploading(false);
    };

    const insertImageMarkdown = (url) => {
        setContentInput((prev) => prev + `\n![Image](${url})\n`);
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 p-6">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Articles</h2>
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className={`p-2 cursor-pointer hover:bg-gray-700 ${selectedArticle?.id === article.id ? "bg-gray-700" : ""}`}
                        onClick={() => handleSelectArticle(article)}
                    >
                        {article.title}
                    </div>
                ))}

                {/* Uploaded Images */}
                <h2 className="text-lg font-semibold mt-4">Uploaded Images</h2>
                {uploadedImages.map((img) => (
                    <img
                        key={img.id}
                        src={img.publicUrl}
                        alt="Thumbnail"
                        className="w-full h-20 object-cover mb-2 cursor-pointer"
                        onClick={() => insertImageMarkdown(img.publicUrl)}
                    />
                ))}

                {/* Drag & Drop Image Upload */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="w-full h-20 bg-gray-700 flex items-center justify-center cursor-pointer mt-2"
                >
                    {uploading ? "Uploading..." : "Drag & Drop Image Here"}
                </div>
            </div>

            {/* Editor Section */}
            <div className="w-3/4 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-400">CONTENT</h1>

                <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <textarea
                    className="w-full h-80 p-4 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg focus:outline-none"
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Write article here...."
                ></textarea>

                <button
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                    onClick={handleSaveArticle}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Article"}
                </button>

                {/* Preview */}
                <h1 className="text-2xl font-bold mb-4 text-gray-400 mt-6">PREVIEW</h1>
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
                    <ReactMarkdown>{contentInput}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
