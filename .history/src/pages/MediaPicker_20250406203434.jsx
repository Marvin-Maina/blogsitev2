// MediaPicker.jsx
import { useState, useEffect } from "react";

export default function MediaPicker({ onSelect, onClose }) {
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("mediaFiles");
    if (stored) {
      setMediaFiles(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-11/12 max-w-3xl shadow-lg border border-yellow-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text--300">📁 Select Media</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-300 transition"
          >
            ✖
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh]">
          {mediaFiles.map((file, index) => (
            <img
              key={index}
              src={file.url}
              alt={file.name}
              className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition"
              onClick={() => {
                onSelect(file.url);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
