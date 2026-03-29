"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Leaf, RefreshCcw } from "lucide-react";

export default function ResultPanel({ result, onReset }) {
  const containerRef = useRef(null);
  
  // Hardcoded UI Mapping constraints specified by the strict instructions
  const getTheme = (className) => {
    switch (className) {
      case "Early Blight":
        return {
          color: "#E67E22",
          treatment: "Apply fungicide containing chlorothalonil. Remove infected leaves. Improve air circulation."
        };
      case "Late Blight":
        return {
          color: "#C0392B",
          treatment: "Apply copper-based fungicide immediately. Destroy infected plants to prevent spread."
        };
      case "Healthy":
        return {
          color: "#27AE60",
          treatment: "Your plant looks healthy! Continue regular care and monitor weekly."
        };
      default:
        // Fallback catch-all referencing green
        return { color: "#27AE60", treatment: "" };
    }
  };

  useEffect(() => {
    if (result && containerRef.current) {
      const ctx = gsap.context(() => {
        // Root container slide + fade
        gsap.from(containerRef.current, {
          x: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });

        // Typewriter effect for Disease Name
        gsap.fromTo(
          ".typewriter",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)", delay: 0.3 }
        );

        // Main Confidence score counter
        const confObj = { val: 0 };
        gsap.to(confObj, {
          val: result.confidence * 100,
          duration: 2,
          ease: "power2.out",
          delay: 0.4,
          onUpdate: () => {
            const el = document.querySelector(".conf-number");
            if (el) el.innerHTML = confObj.val.toFixed(2);
          }
        });

        // Horizontal Confidence Bars
        const bars = gsap.utils.toArray(".conf-bar-fill");
        bars.forEach((bar, index) => {
          const targetWidth = bar.getAttribute("data-width");
          gsap.to(bar, {
            width: `${targetWidth}%`,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.6 + (index * 0.1)
          });
        });

        // Treatment details fade up
        gsap.fromTo(
          ".treatment-card",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1 }
        );

      }, containerRef);
      return () => ctx.revert();
    }
  }, [result]);

  if (!result) {
    return (
      <div className="w-full h-full min-h-[500px] border border-forest/30 rounded-2xl flex flex-col justify-center items-center bg-dark/20 p-8 text-center border-dashed">
        <Leaf size={100} className="text-forest/20 mb-6 drop-shadow-md" />
        <h2 className="text-3xl font-playfair text-text/40 mb-2">Analysis Hub</h2>
        <p className="text-text/30 font-inter max-w-sm">
          Awaiting algorithmic submission. Your diagnostic results will dynamically appear here.
        </p>
      </div>
    );
  }

  const themeOptions = getTheme(result.predicted_class);

  return (
    <div ref={containerRef} className="w-full bg-dark/80 rounded-2xl border border-forest/30 p-8 shadow-2xl overflow-hidden relative">
      {/* Decorative background glow */}
      <div 
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeOptions.color }}
      ></div>

      <div className="flex justify-between items-start mb-10 border-b border-forest/30 pb-6">
        <div>
          <p className="text-text/50 font-inter text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: themeOptions.color }}></span>
            Diagnosed Class
          </p>
          <h2 className="typewriter text-4xl md:text-5xl font-black font-playfair tracking-tight" style={{ color: themeOptions.color }}>
            {result.predicted_class}
          </h2>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <p className="text-text/50 font-inter text-sm uppercase tracking-widest mb-1">Confidence</p>
          <div className="flex items-baseline text-text font-inter">
            <span className="conf-number text-5xl font-black tracking-tighter" style={{ color: themeOptions.color }}>0</span>
            <span className="text-2xl font-bold ml-1 text-text/50">%</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-text/70 font-playfair text-xl mb-6">Prediction Probability Distribution</h3>
        <div className="space-y-4">
          {Object.entries(result.all_scores).map(([className, score]) => {
            const classTheme = getTheme(className);
            const percentage = (score * 100).toFixed(2);
            
            return (
              <div key={className} className="w-full">
                <div className="flex justify-between text-sm font-inter mb-1">
                  <span className="text-text/80">{className}</span>
                  <span className="text-text/50 font-mono">{percentage}%</span>
                </div>
                <div className="w-full h-3 bg-forest/20 rounded-full overflow-hidden">
                  <div 
                    className="conf-bar-fill h-full rounded-full transition-all"
                    style={{ backgroundColor: classTheme.color, width: '0%' }}
                    data-width={percentage}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="treatment-card bg-forest/10 border border-forest/40 rounded-xl p-6 relative">
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: themeOptions.color }}></div>
        <h4 className="text-text/90 font-bold mb-2 uppercase text-sm tracking-wider flex items-center gap-2" style={{ color: themeOptions.color }}>
          <Leaf size={16} /> Treatment Protocol
        </h4>
        <p className="text-text/70 font-inter leading-relaxed">
          {themeOptions.treatment}
        </p>
      </div>

      <div className="mt-10 flex justify-end">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-text/50 hover:text-white transition-colors"
        >
          <RefreshCcw size={18} /> Reset Analysis
        </button>
      </div>
    </div>
  );
}
