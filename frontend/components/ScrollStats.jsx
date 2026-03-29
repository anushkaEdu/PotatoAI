"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollStats() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Background shift
      gsap.to(containerRef.current, {
        backgroundColor: "#2B1E12", // Earthy brown 
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });

      // Counting animations
      const counters = gsap.utils.toArray(".stat-num");
      counters.forEach((counter) => {
        const targetValue = parseInt(counter.getAttribute("data-target").replace(/,/g, ""));
        gsap.to(counter, {
          textContent: targetValue,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          snap: { textContent: 1 },
          onUpdate: function() {
            // Re-apply commas if target was huge (like 2,000,000,000)
            if (targetValue > 1000) {
              counter.innerHTML = Math.ceil(this.targets()[0].textContent).toLocaleString();
            } else {
              counter.innerHTML = Math.ceil(this.targets()[0].textContent) + (counter.getAttribute("data-suffix") || "");
            }
          }
        });
      });

      // Cards slide in
      gsap.fromTo(".stat-card", 
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.2,
          scrollTrigger: { trigger: ".stat-container", start: "base 80%" }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-dark relative overflow-hidden transition-colors duration-1000">
      <div className="absolute inset-0 bg-leaf-texture mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-20 text-text">The Urgency of Detection</h2>
        
        <div className="stat-container grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="stat-card flex flex-col items-center">
            <span 
              className="stat-num text-5xl md:text-6xl font-black text-leaf mb-4 font-inter" 
              data-target="2000000000"
              data-suffix="+"
            >0</span>
            <span className="text-leaf text-4xl font-black absolute translate-x-[4.5rem] mt-1">+</span>
            <h3 className="text-xl font-semibold text-text/90">Potatoes Consumed Daily</h3>
            <p className="text-text/60 mt-2">Feeding the world's population.</p>
          </div>

          <div className="stat-card flex flex-col items-center">
            <span 
              className="stat-num text-5xl md:text-6xl font-black text-warning mb-4 font-inter" 
              data-target="30"
              data-suffix="%"
            >0</span>
            <h3 className="text-xl font-semibold text-text/90">Crop Yield Lost</h3>
            <p className="text-text/60 mt-2">To Early Box and Blight diseases annually.</p>
          </div>

          <div className="stat-card flex flex-col items-center">
            <span 
              className="stat-num text-5xl md:text-6xl font-black text-danger mb-4 font-inter" 
              data-target="152"
            >0</span>
            <h3 className="text-xl font-semibold text-text/90">Healthy Images Available</h3>
            <p className="text-text/60 mt-2">Showcasing the severe class imbalance problem.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
