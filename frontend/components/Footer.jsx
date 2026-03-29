"use client";
import { useEffect } from "react";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      ".footer-anim",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".footer-anim",
          start: "top bottom",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <footer className="footer-anim bg-[#0A120A] pt-12 pb-8 border-t border-forest/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <div className="mb-6">
          <Link href="/" className="font-playfair text-3xl font-bold tracking-wider text-text">
            🌿 Potato<span className="text-leaf">AI</span>
          </Link>
        </div>

        <nav className="mb-8 flex space-x-6">
          <Link href="/" className="text-text/70 hover:text-leaf transition-colors">Home</Link>
          <Link href="/predict" className="text-text/70 hover:text-leaf transition-colors">Predict</Link>
          <Link href="/model" className="text-text/70 hover:text-leaf transition-colors">Model</Link>
        </nav>

        <div className="w-24 h-[1px] bg-leaf/50 mb-8 rounded-full"></div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm text-text/50 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3 text-center md:text-left">
            © 2026 Potato Disease Detector | MUJ B.Tech AIML
          </div>
          
          <div className="w-full md:w-1/3 text-center">
            Made with ❤️ by Anushka Kanaujia
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center md:justify-end space-x-5">
            <a 
              href="https://linkedin.com/in/anushka-kanaujia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text/50 hover:text-leaf transition-all transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(124,181,24,0.8)]"
            >
              <FaLinkedin size={22} />
            </a>
            <a 
              href="https://github.com/anushka-kanaujia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text/50 hover:text-leaf transition-all transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(124,181,24,0.8)]"
            >
              <FaGithub size={22} />
            </a>
            <a 
              href="mailto:anushka.kanaujia@gmail.com" 
              className="text-text/50 hover:text-leaf transition-all transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(124,181,24,0.8)]"
            >
              <FaEnvelope size={22} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
