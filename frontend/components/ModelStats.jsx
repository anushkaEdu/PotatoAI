"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Database, TrendingUp, Cpu, Layers } from "lucide-react";

export default function ModelStats() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      // Hero stats row
      gsap.fromTo(
        ".model-stat-card",
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".model-stats-grid", start: "top 85%" }
        }
      );

      // CNN Architecture progressive reveal
      gsap.fromTo(
        ".cnn-block",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: ".cnn-diagram", start: "top 75%" }
        }
      );

      // Per-Class performance cards logic
      const performanceBars = gsap.utils.toArray(".perf-bar-fill");
      performanceBars.forEach((bar) => {
        const targetWidth = bar.getAttribute("data-width");
        gsap.fromTo(bar, 
          { width: "0%" },
          { 
            width: `${targetWidth}%`, duration: 1.5, ease: "power2.out",
            scrollTrigger: { trigger: bar, start: "top 85%" }
          }
        );
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full text-text overflow-hidden">
      
      {/* SECTION 1: HERO STATS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl text-text font-playfair font-bold mb-10 text-center">Architectural Metrics</h2>
        <div className="model-stats-grid grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="model-stat-card bg-dark border border-forest/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg hover:border-leaf transition-colors">
            <TrendingUp size={32} className="text-leaf mb-4" />
            <span className="text-4xl font-black font-inter text-text mb-2 tracking-tighter">95.37%</span>
            <span className="text-text/50 text-sm uppercase tracking-widest font-bold">Test Accuracy</span>
          </div>

          <div className="model-stat-card bg-dark border border-forest/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg hover:border-leaf transition-colors">
            <Database size={32} className="text-leaf mb-4" />
            <span className="text-4xl font-black font-inter text-text mb-2 tracking-tighter">2,152</span>
            <span className="text-text/50 text-sm uppercase tracking-widest font-bold">Training Images</span>
          </div>

          <div className="model-stat-card bg-dark border border-forest/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg hover:border-leaf transition-colors">
            <ActivityIcon />
            <span className="text-4xl font-black font-inter text-text mb-2 tracking-tighter">36</span>
            <span className="text-text/50 text-sm uppercase tracking-widest font-bold">Epochs Trained</span>
          </div>

          <div className="model-stat-card bg-dark border border-forest/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg hover:border-leaf transition-colors">
            <Cpu size={32} className="text-leaf mb-4" />
            <span className="text-4xl font-black font-inter text-text mb-2 tracking-tighter">4.6M</span>
            <span className="text-text/50 text-sm uppercase tracking-widest font-bold">Parameters</span>
          </div>

        </div>
      </section>

      {/* SECTION 2: CNN Architecture */}
      <section className="py-20 bg-forest/5 border-y border-forest/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-text font-playfair font-bold mb-6">5-Layer Convolutional Network</h2>
          <p className="text-text/60 max-w-2xl mx-auto mb-16 text-lg">
            Our sequential neural network ingests robust image gradients across dense spatial max-pooling down-samples.
          </p>

          <div className="cnn-diagram flex flex-wrap justify-center items-center gap-4 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-forest/10 via-leaf/50 to-forest/10 -translate-y-1/2 z-0"></div>
            
            <Block title="Input" detail="256×256×3" color="bg-dark border-earth/50" textColor="text-earth" z="z-10" />
            <Arrow />
            <Block title="Conv2D + MaxPool" detail="32 Filters" color="bg-[#1C3610]" z="z-10" />
            <Arrow />
            <Block title="Conv2D + MaxPool" detail="64 Filters" color="bg-[#244A14]" z="z-10" />
            <Arrow />
            <Block title="Conv2D + MaxPool" detail="64 Filters" color="bg-[#2D5A1B]" z="z-10" />
            <Arrow />
            <Block title="Conv2D + MaxPool" detail="128 Filters" color="bg-[#468228]" z="z-10" />
            <Arrow />
            <Block title="Conv2D + MaxPool" detail="256 Filters" color="bg-[#5CA636]" z="z-10" />
            <Arrow />
            <Block title="Dense + Dropout" detail="256 Units (30% Drop)" color="bg-[#7CB518] text-dark shadow-lg shadow-leaf/30" textColor="text-dark" z="z-10" />
            <Arrow />
            <Block title="Output" detail="3 (Softmax)" color="bg-dark border border-leaf shadow-[0_0_30px_rgba(124,181,24,0.5)]" textColor="text-leaf" z="z-10" />
          </div>
        </div>
      </section>

      {/* SECTION 4: Per-Class Performance */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl text-text font-playfair font-bold mb-16 text-center">Class Recognition Validity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="cnn-block bg-dark border border-warning/30 rounded-2xl p-8 hover:border-warning hover:shadow-[0_10px_30px_rgba(230,126,34,0.1)] transition-all">
            <h3 className="text-2xl font-bold font-playfair text-warning mb-6">Early Blight</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1 font-inter text-sm font-bold text-text/80"><span className="uppercase tracking-wider">Accuracy</span><span>98.9%</span></div>
              <div className="w-full h-2 bg-warning/10 rounded-full overflow-hidden"><div className="perf-bar-fill h-full bg-warning" data-width="98.9"></div></div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1 font-inter text-sm font-bold text-text/80"><span className="uppercase tracking-wider">F1-Score</span><span>0.9735</span></div>
              <div className="w-full h-2 bg-warning/10 rounded-full overflow-hidden"><div className="perf-bar-fill h-full bg-warning" data-width="97.35"></div></div>
            </div>
          </div>

          <div className="cnn-block bg-dark border border-danger/30 rounded-2xl p-8 hover:border-danger hover:shadow-[0_10px_30px_rgba(192,57,43,0.1)] transition-all">
            <h3 className="text-2xl font-bold font-playfair text-danger mb-6">Late Blight</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1 font-inter text-sm font-bold text-text/80"><span className="uppercase tracking-wider">Accuracy</span><span>93.0%</span></div>
              <div className="w-full h-2 bg-danger/10 rounded-full overflow-hidden"><div className="perf-bar-fill h-full bg-danger" data-width="93"></div></div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1 font-inter text-sm font-bold text-text/80"><span className="uppercase tracking-wider">F1-Score</span><span>0.9554</span></div>
              <div className="w-full h-2 bg-danger/10 rounded-full overflow-hidden"><div className="perf-bar-fill h-full bg-danger" data-width="95.54"></div></div>
            </div>
          </div>

          <div className="cnn-block bg-dark border border-healthy/30 rounded-2xl p-8 hover:border-healthy hover:shadow-[0_10px_30px_rgba(39,174,96,0.1)] transition-all">
            <h3 className="text-2xl font-bold font-playfair text-healthy mb-6">Healthy</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1 font-inter text-sm font-bold text-text/80"><span className="uppercase tracking-wider">Accuracy</span><span>87.5%</span></div>
              <div className="w-full h-2 bg-healthy/10 rounded-full overflow-hidden"><div className="perf-bar-fill h-full bg-healthy" data-width="87.5"></div></div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1 font-inter text-sm font-bold text-text/80"><span className="uppercase tracking-wider">F1-Score</span><span>0.7368</span></div>
              <div className="w-full h-2 bg-healthy/10 rounded-full overflow-hidden"><div className="perf-bar-fill h-full bg-healthy" data-width="73.68"></div></div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 & 6: Datasets and Tech Stack */}
      <section className="py-20 border-t border-forest/30 bg-dark text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold mb-10">Dataset Balancing</h2>
          
          <div className="cnn-block flex flex-col md:flex-row justify-center items-stretch gap-4 h-32 w-full mb-6">
            <div className="bg-warning flex justify-center items-center font-bold text-dark w-full md:w-[46.5%] rounded-l-full md:rounded-r-none rounded-r-full shadow-lg h-full p-4 flex-col justify-center">
              <span className="text-2xl block">1,000</span>
              <span className="text-sm opacity-80 uppercase tracking-wider">Early Blight (46.5%)</span>
            </div>
            <div className="bg-danger flex justify-center items-center font-bold text-white w-full md:w-[46.5%] shadow-lg h-full p-4 flex-col justify-center">
              <span className="text-2xl block">1,000</span>
              <span className="text-sm opacity-80 uppercase tracking-wider">Late Blight (46.5%)</span>
            </div>
             <div className="bg-healthy flex justify-center items-center font-bold text-dark w-full md:w-[7%] rounded-r-full md:rounded-l-none rounded-l-full shadow-lg h-full p-4 flex-col justify-center">
              <span className="text-xl block">152</span>
              <span className="text-xs opacity-80 uppercase tracking-wider hidden md:block">Healthy</span>
            </div>
          </div>
          <p className="text-text/50 font-inter max-w-lg mx-auto italic mb-32">
            * Class Imbalance was strictly handled with a weighted categorical crossentropy loss calculation during pipeline execution (4.7× weight penalty for Healthy).
          </p>

          <h2 className="text-2xl font-playfair font-bold text-text/60 uppercase tracking-widest mb-10">Core Technologies</h2>
          <div className="cnn-block flex flex-wrap justify-center items-center gap-6 opacity-70">
            <BadgeText text="TensorFlow" />
            <BadgeText text="Keras" />
            <BadgeText text="Python 3" />
            <BadgeText text="Kaggle GPU T4" />
            <BadgeText text="FastAPI" />
            <BadgeText text="React & Next.js" />
            <BadgeText text="Three.js" />
            <BadgeText text="GSAP" />
          </div>
        </div>
      </section>

    </div>
  );
}

// Helpers
function Block({ title, detail, color = "bg-forest border-leaf", textColor = "text-text", z }) {
  return (
    <div className={`cnn-block ${color} ${z} border-2 border-transparent px-6 py-4 rounded-xl flex flex-col items-center justify-center min-w-[140px] shadow-lg`}>
      <span className={`font-bold font-inter text-sm mb-1 ${textColor}`}>{title}</span>
      <span className={`text-xs opacity-80 font-mono ${textColor}`}>{detail}</span>
    </div>
  );
}

function Arrow() {
  return <div className="hidden lg:block class-arrow text-leaf/50">→</div>;
}

function BadgeText({ text }) {
  return <span className="px-5 py-2 rounded-full border border-forest/50 text-text/80 font-bold tracking-wider uppercase text-sm cursor-default hover:bg-forest/20 hover:text-white hover:border-leaf transition-colors">{text}</span>
}

function ActivityIcon() {
  return (
    <svg className="text-leaf mb-4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
