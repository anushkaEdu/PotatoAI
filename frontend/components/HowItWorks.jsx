"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Cpu, Activity } from "lucide-react";

export default function HowItWorks() {
  const containerRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // We use the 300vh container as the scrub tracker
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // Progress bar transitions and step swaps based on pure scroll progress
      // 0 to 33%: Step 1 -> Step 2
      tl.to(stepsRef.current[0], { opacity: 0, y: -50, duration: 1 }, 1)
        .fromTo(stepsRef.current[1], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 1)
        .to(".dot-1", { backgroundColor: "#2D5A1B", scale: 1, boxShadow: "none" }, 1)
        .to(".dot-2", { backgroundColor: "#7CB518", scale: 1.5, boxShadow: "0 0 10px #7CB518" }, 1)
        
      // 33% to 66%: Step 2 wait...
      
      // 66% to 100%: Step 2 -> Step 3
        .to(stepsRef.current[1], { opacity: 0, y: -50, duration: 1 }, 3)
        .fromTo(stepsRef.current[2], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 3)
        .to(".dot-2", { backgroundColor: "#2D5A1B", scale: 1, boxShadow: "none" }, 3)
        .to(".dot-3", { backgroundColor: "#7CB518", scale: 1.5, boxShadow: "0 0 10px #7CB518" }, 3);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-dark border-t border-forest/30">
      {/* Sticky Container locks to screen while we scroll the 300vh parent */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center gap-8 relative z-10">
          
          {/* Progress Tracker Left Side */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-6 mr-8 h-64 border-l-2 border-forest/30 pl-8">
            <div className="dot-1 w-4 h-4 rounded-full bg-leaf shadow-[0_0_10px_#7CB518] scale-125 transition-colors"></div>
            <div className="w-[2px] h-12 bg-forest/30"></div>
            <div className="dot-2 w-4 h-4 rounded-full bg-forest transition-colors"></div>
            <div className="w-[2px] h-12 bg-forest/30"></div>
            <div className="dot-3 w-4 h-4 rounded-full bg-forest transition-colors"></div>
          </div>

          {/* Steps Container */}
          <div className="relative w-full h-[60vh] flex items-center justify-center">
            
            {/* STEP 1 */}
            <div ref={el => stepsRef.current[0] = el} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-12 w-full text-center md:text-left text-text">
              <div className="w-48 h-48 rounded-full bg-forest/10 flex items-center justify-center border border-leaf/20 shadow-[0_0_50px_rgba(45,90,27,0.3)] backdrop-blur-sm">
                 <Camera size={64} className="text-leaf" />
              </div>
              <div className="max-w-md">
                <span className="text-leaf font-bold text-xl tracking-widest mb-2 block font-inter">01</span>
                <h2 className="text-5xl font-playfair font-bold mb-4">Upload</h2>
                <p className="text-xl text-text/70 leading-relaxed">Take a photo of your potato leaf and upload it securely into our portal.</p>
              </div>
            </div>

            {/* STEP 2 */}
            <div ref={el => stepsRef.current[1] = el} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-12 w-full opacity-0 text-center md:text-left text-text">
               <div className="w-48 h-48 rounded-full bg-forest/10 flex items-center justify-center border border-leaf/20 shadow-[0_0_50px_rgba(45,90,27,0.3)] backdrop-blur-sm">
                 <Cpu size={64} className="text-leaf" />
              </div>
              <div className="max-w-md">
                <span className="text-leaf font-bold text-xl tracking-widest mb-2 block font-inter">02</span>
                <h2 className="text-5xl font-playfair font-bold mb-4">Analyse</h2>
                <p className="text-xl text-text/70 leading-relaxed">Our advanced CNN model processes 256×256 scaling representations in milliseconds.</p>
              </div>
            </div>

            {/* STEP 3 */}
            <div ref={el => stepsRef.current[2] = el} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-12 w-full opacity-0 text-center md:text-left text-text">
               <div className="w-48 h-48 rounded-full bg-forest/10 flex items-center justify-center border border-leaf/20 shadow-[0_0_50px_rgba(45,90,27,0.3)] backdrop-blur-sm">
                 <Activity size={64} className="text-leaf" />
              </div>
              <div className="max-w-md">
                <span className="text-leaf font-bold text-xl tracking-widest mb-2 block font-inter">03</span>
                <h2 className="text-5xl font-playfair font-bold mb-4">Diagnose</h2>
                <p className="text-xl text-text/70 leading-relaxed">Instantly receive the exact disease classification and agricultural treatment advice.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
