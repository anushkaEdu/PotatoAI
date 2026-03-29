"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../components/Hero";
import ScrollStats from "../components/ScrollStats";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  const cardsRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Our Solution Cards staggered slide in alternating
    const cards = gsap.utils.toArray(".solution-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Accuracy count up
    gsap.fromTo(
      ".accuracy-num",
      { textContent: "0" },
      {
        textContent: "95.37",
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".accuracy-container",
          start: "top 80%",
        },
        snap: { textContent: 0.01 },
      }
    );

    // Pulse CTA
    gsap.to(".cta-btn", {
      scale: 1.05,
      boxShadow: "0 0 25px rgba(124,181,24,0.8)",
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut"
    });

  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-dark w-full pt-10">
      
      {/* SECTION 1: HERO */}
      <Hero />

      {/* SECTION 2: THE PROBLEM */}
      <ScrollStats />

      {/* SECTION 3: OUR SOLUTION */}
      <section className="py-32 bg-[#0A120A] relative border-t border-forest/30 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={cardsRef}>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-text mb-24">Precision Architecture.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="solution-card bg-dark border border-forest/50 rounded-2xl p-10 text-left hover:border-leaf transition-colors group">
              <div className="text-5xl mb-6">🌿</div>
              <h3 className="text-2xl font-bold text-text mb-4 font-inter">Deep Learning CNN</h3>
              <p className="text-text/70 leading-relaxed text-lg">
                5-layer convolutional network trained on the robust PlantVillage visual dataset.
              </p>
            </div>

            {/* Card 2 */}
            <div className="solution-card bg-dark border border-forest/50 rounded-2xl p-10 text-left hover:border-leaf transition-colors group">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-text mb-4 font-inter">Instant Analysis</h3>
              <p className="text-text/70 leading-relaxed text-lg">
                Upload a detailed leaf photo and receive immediate results mapping in under a second.
              </p>
            </div>

            {/* Card 3 */}
            <div className="solution-card bg-dark border border-forest/50 rounded-2xl p-10 text-left hover:border-leaf transition-colors group">
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-text mb-4 font-inter">95.37% Accuracy</h3>
              <p className="text-text/70 leading-relaxed text-lg">
                Trained dynamically on 2,152 images utilizing GPU T4 computational acceleration on Kaggle workloads.
              </p>
            </div>
          </div>

          <div className="accuracy-container mt-32 text-center flex flex-col items-center">
            <div className="text-leaf text-8xl md:text-[10rem] font-black font-inter tracking-tighter shadow-leaf drop-shadow-2xl">
              <span className="accuracy-num">0</span>%
            </div>
            <p className="text-2xl text-text/50 font-playfair italic mt-4">Verified Test Validation Accuracy</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <HowItWorks />

      {/* SECTION 5: CTA BANNER */}
      <section className="py-32 relative bg-gradient-to-br from-forest to-dark overflow-hidden z-10 border-b border-forest">
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-20">
          <h2 className="text-5xl md:text-7xl font-playfair font-bold text-text mb-6">Is your crop at risk?</h2>
          <p className="text-2xl text-text/80 mb-12 font-light">Upload a leaf image and find out directly in seconds.</p>
          
          <Link 
            href="/predict" 
            className="cta-btn inline-block bg-leaf text-dark px-12 py-5 rounded-full text-2xl font-bold tracking-wide transition-colors hover:bg-white focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-forest"
          >
            Try It Free →
          </Link>
        </div>
      </section>

    </div>
  );
}
