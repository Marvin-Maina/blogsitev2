import { useState, useEffect } from "react";

export default function MediaManager() {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const storedMedia = JSON.parse(localStorage.getItem("media")) || [];
    setMediaList(storedMedia);
  }, []);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        newMedia.push({ url, name: file.name });

        if (newMedia.length === files.length) {
          const updatedMedia = [...mediaList, ...newMedia];
          setMediaList(updatedMedia);
          localStorage.setItem("media", JSON.stringify(updatedMedia));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (index) => {
    const updatedMedia = mediaList.filter((_, i) => i !== index);
    setMediaList(updatedMedia);
    localStorage.setItem("media", JSON.stringify(updatedMedia));
  };

  return (
    <div className="p-6 ml-20 min-h-screen bg-gray-900 text-gray-200">
      <h1 className="text-2xl font-bold mb-4">🖼 Media Uploads</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="mb-4"
      />

      {mediaList.length === 0 ? (
        <p className="text-gray-400">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaList.map((media, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 relative"
            >
              <img
                src={media.url}
                alt={media.name}
                className="w-full h-40 object-cover rounded"
              />
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                Delete
              </button>
              <p className="text-xs mt-1 break-all">{media.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
