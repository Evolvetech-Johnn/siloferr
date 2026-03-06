"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Sobre a Siloferr", href: "#about" },
  { label: "Serviços", href: "#services" },
  { label: "Produtos", href: "#products" },
  { label: "Contatos", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Naive active section detection
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "#hero";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = `#${section.id}`;
        }
      });

      if (window.scrollY === 0) currentSection = "#hero";
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="#hero" className="relative z-50 transition-transform duration-300 hover:scale-105">
          <Image
            src="https://siloferr.com.br/Content/img/logo.png"
            alt="Siloferr Peças Agrícolas"
            width={180}
            height={55}
            priority
            className={cn("w-auto transition-all duration-300", isScrolled ? "h-9" : "h-11")}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative font-heading font-medium pb-1.5 transition-colors",
                    !isScrolled && activeSection !== link.href ? "text-white drop-shadow-md hover:text-white/80" : "text-text-main hover:text-primary-dark",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300",
                    activeSection === link.href ? "after:w-full" : "after:w-0 hover:after:w-full"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <Link
            href="https://api.whatsapp.com/send?phone=5543988032859"
            target="_blank"
            className="btn-accent px-5 py-2.5 text-sm"
          >
            Solicitar Cotação
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className={cn(
            "lg:hidden relative z-50 p-2",
            isScrolled || isMobileMenuOpen ? "text-primary-dark" : "text-white drop-shadow-md"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out lg:hidden",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <ul className="flex flex-col items-center gap-6 mb-8 w-full p-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="w-full text-center">
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block w-full py-3 text-2xl font-heading font-bold",
                    activeSection === link.href ? "text-primary" : "text-text-main"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="https://api.whatsapp.com/send?phone=5543988032859"
            target="_blank"
            className="btn-accent w-4/5 py-4 text-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Solicitar Cotação
          </Link>
        </div>
      </div>
    </header>
  );
}
