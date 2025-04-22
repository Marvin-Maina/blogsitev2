import { useEffect, useRef, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const MediaPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark"; // 🌗 Clean boolean for styling toggle

  const [mediaFiles, setMediaFiles] = useState(() => {
    const stored = localStorage.getItem("mediaFiles");
    return stored ? JSON.parse(stored) : [];
  });

  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const updatedFiles = [...mediaFiles];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        updatedFiles.push({ name: file.name, url: reader.result });
        setMediaFiles(updatedFiles);
        localStorage.setItem("mediaFiles", JSON.stringify(updatedFiles));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className={`p-6 ml-20 h-screen transition duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-6 ${
          isDarkMode ? "text-violet-300" : "text-violet-600"
        }`}
      >
        📸 Media Library
      </h1>

      {/* Dropzone */}
      <div
        ref={dropzoneRef}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-4 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition mb-8 ${
          isDarkMode
            ? "border-violet-500 hover:bg-green-500/10 bg-gray-800 text-gray-300"
            : "border-violet-400 hover:bg-green-100 bg-white text-gray-600"
        }`}
      >
        <p className="text-lg">Drag and drop files here</p>
        <p className="text-sm">or click to upload</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mediaFiles.map((file, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg shadow transition ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-32 object-cover rounded"
            />
            <p
              className={`mt-2 text-sm text-center ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
