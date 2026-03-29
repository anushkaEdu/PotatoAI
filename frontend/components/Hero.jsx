"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import LeafCanvas from "./LeafCanvas";

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger fade in + slide up
      gsap.fromTo(
        ".hero-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.3, ease: "power3.out", delay: 0.1 }
      );

      // Subheading fade
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.out", delay: 1.2 }
      );

      // Button scale/fade
      gsap.fromTo(
        ".hero-btn",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)", delay: 1.6 }
      );

      // Arrow bouncing
      gsap.fromTo(
        ".scroll-arrow",
        { y: 0 },
        { y: 15, duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-dark flex items-center justify-center overflow-hidden pt-20">
      {/* Particle background faint overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col md:flex-row items-center justify-between relative z-10">
        
        {/* Left Side Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-8 z-20">
          <h1 className="font-playfair font-bold text-6xl md:text-8xl leading-tight text-text">
            <span className="hero-text block text-leaf">Detect.</span>
            <span className="hero-text block">Diagnose.</span>
            <span className="hero-text block">Protect.</span>
          </h1>
          
          <div className="hero-sub text-lg md:text-xl text-text/80 max-w-lg font-light leading-relaxed">
            <p>AI-powered potato leaf disease detection.</p>
            <p className="text-leaf font-semibold">95.37% accuracy. Instant results.</p>
          </div>

          <div className="hero-btn pt-4">
            <Link 
              href="/predict" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark bg-leaf rounded-full transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(124,181,24,0.6)]"
            >
              Analyse Your Crop <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Right Side 3D Canvas */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-full relative">
          <LeafCanvas />
          {/* Mobile Leaf fallback */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-64 h-64 bg-leaf rounded-full blur-[100px]"></div>
            <span className="text-6xl absolute">🌿</span>
          </div>
        </div>
      </div>

      {/* Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-arrow text-text/50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
