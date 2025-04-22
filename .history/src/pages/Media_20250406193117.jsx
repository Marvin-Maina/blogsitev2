import { useState } from "react";

export default function Media() {
  const [mediaList, setMediaList] = useState(
    JSON.parse(localStorage.getItem("media")) || []
  );

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));

    const updatedList = [...mediaList, ...newMedia];
    setMediaList(updatedList);
    localStorage.setItem("media", JSON.stringify(updatedList));
  };

  return (
    <div className="p-6 ml-20 text-white">
      <h1 className="text-2xl font-bold mb-4">Media Library</h1>
      <input type="file" multiple onChange={handleUpload} className="mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mediaList.map((media, index) => (
          <div key={index} className="bg-gray-800 p-2 rounded">
            <img src={media.url} alt={media.name} className="w-full h-40 object-cover rounded" />
            <p className="text-sm mt-2">{media.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
