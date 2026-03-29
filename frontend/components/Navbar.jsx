"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // GSAP Navbar slide down
    gsap.fromTo(
      ".navbar-anim",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Predict", href: "/predict" },
    { name: "Model", href: "/model" },
  ];

  return (
    <nav
      className={`navbar-anim fixed z-50 transition-all duration-500 ease-out left-1/2 -translate-x-1/2 ${
        isScrolled 
          ? "top-6 w-[95%] md:w-[700px] bg-[#0A120A]/80 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full border border-forest/40" 
          : "top-0 w-full bg-transparent border-transparent"
      }`}
    >
      <div className={`transition-all duration-500 ${isScrolled ? "w-full px-6 md:px-10" : "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? "h-16" : "h-20"}`}>
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-playfair text-2xl font-bold tracking-wider text-text">
              🌿 Potato<span className="text-leaf">AI</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-leaf ${
                  pathname === link.href ? "text-leaf border-b-2 border-leaf pb-1" : "text-text/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text hover:text-leaf transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md absolute w-full border-t border-forest/30 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  pathname === link.href ? "text-leaf bg-forest/20" : "text-text/80 hover:text-leaf hover:bg-forest/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
