"use client";
import { useState, useRef } from "react";
import { UploadCloud, Leaf } from "lucide-react";

export default function UploadZone({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid JPG, PNG, or WEBP image.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleReset = (e) => {
    e.stopPropagation(); // prevent opening file dialog
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div 
        className={`relative w-full aspect-square max-w-xl rounded-2xl border-4 border-dashed transition-all duration-300 flex flex-col justify-center items-center cursor-pointer group ${
          isHovering ? "border-leaf bg-forest/10" : "border-forest/50 bg-dark/50"
        } ${preview ? "border-solid border-leaf shadow-[0_0_30px_rgba(124,181,24,0.15)]" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />

        {!preview ? (
          <div className="text-center p-8 mt-12 mb-12 flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 ease-in-out ${isHovering ? "rotate-[15deg] scale-110 shadow-[0_0_20px_#7CB518] border-leaf border" : "bg-forest/20 text-text/50"}`}>
              <Leaf size={48} className={isHovering ? "text-leaf" : ""} />
            </div>
            <h3 className="text-2xl font-bold font-playfair mb-2 text-text">Drop your leaf image here</h3>
            <p className="text-text/50 font-inter mb-6">or click to browse local files</p>
            <div className="text-xs text-text/30 font-inter uppercase tracking-widest border border-forest/50 px-3 py-1 rounded-full">JPG, PNG, WEBP Supported</div>
            {error && <p className="text-danger bg-danger/10 px-4 py-2 mt-4 rounded-md animate-pulse">{error}</p>}
          </div>
        ) : (
          <div className="w-full h-full relative group rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Leaf Preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-text text-dark font-bold rounded-full hover:bg-leaf transition-colors"
                disabled={loading}
              >
                Change Image
              </button>
            </div>
          </div>
        )}

        {/* Floating action button below upload zone */}
        <div className="absolute -bottom-8 w-full flex justify-center z-20 translate-y-full">
          {preview && (
            <button 
              className={`w-full max-w-sm py-4 rounded-xl text-xl font-bold shadow-xl transition-all flex justify-center items-center ${
                loading ? "bg-forest text-text/50 cursor-not-allowed" : "bg-leaf text-dark hover:bg-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(124,181,24,0.4)]"
              }`}
              onClick={(e) => { e.stopPropagation(); onAnalyze(selectedFile); }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-text/20 border-t-text/80 rounded-full animate-spin mr-3"></div>
                  Analysing Leaf Details...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-3 text-dark" /> Analyse Image Architecture
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
