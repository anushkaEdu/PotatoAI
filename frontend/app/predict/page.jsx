"use client";
import { useState } from "react";
import UploadZone from "../../components/UploadZone";
import ResultPanel from "../../components/ResultPanel";
import { predictDisease } from "../../lib/api";

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (file) => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await predictDisease(file);
      // Wait a slight moment for UX smoothness and dramatic effect
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Failed to analyze image. Ensure FastAPI is active on localhost:8000.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12 w-full flex flex-col justify-center items-center overflow-x-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-leaf/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-5xl font-playfair font-bold text-text mb-4">Diagnostic Portal</h1>
          <p className="text-text/60 font-inter text-lg">
            Upload a clear, macroscopic view of a single potato leaf for an immediate analysis against our PlantVillage trained Convolutional Neural Network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-start">
          
          <div className="flex flex-col h-full w-full justify-center">
            <UploadZone onAnalyze={handleAnalyze} loading={loading} />
          </div>

          <div className="flex flex-col h-full w-full justify-center relative">
            <ResultPanel result={result} onReset={handleReset} />
          </div>

        </div>

      </div>
    </div>
  );
}
