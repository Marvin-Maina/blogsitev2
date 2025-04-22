import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const allArticles = JSON.parse(localStorage.getItem("allArticles")) || [];
    setArticle(allArticles[parseInt(id)]);
  }, [id]);

  if (!article) return <p className="text-center mt-10">Loading article...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-2">By {article.author} • {new Date(article.createdAt).toLocaleDateString()}</p>
      <div
        className="prose prose-invert dark:prose-dark max-w-none mt-6"
        dangerouslySetInnerHTML={{
          __html: article.content
            .replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" alt="Embedded Image" class="max-w-full h-auto my-4 rounded" />')
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>"),
        }}
      />
    </div>
  );
}
