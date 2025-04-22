import { useEffect, useRef, useState } from "react";

const MediaPage = () => {
  const [mediaFiles, setMediaFiles] = useState(() => {
    const stored = localStorage.getItem("mediaFiles");
    return stored ? JSON.parse(stored) : [];
  });

  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  useEffect(() => {
    // Prevent browser from navigating on dropped file
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
    <div className="p-6 ml-20 text-white h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-yellow-300">📸 Media Library</h1>

      {/* Dropzone */}
      <div
        ref={dropzoneRef}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className="border-4 border-dashed border-violet-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-500/10 transition mb-8"
      >
        <p className="text-lg text-gray-400">Drag and drop files here</p>
        <p className="text-sm text-gray-500">or click to upload</p>
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
          <div key={index} className="bg-gray-800 p-2 rounded-lg shadow">
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-32 object-cover rounded"
            />
            <p className="mt-2 text-sm text-center text-gray-300">{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
