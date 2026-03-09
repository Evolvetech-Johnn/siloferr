"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Sobre a Siloferr", href: "/#about" },
  { label: "Serviços", href: "/#services" },
  { label: "Produtos", href: "/produtos" },
  { label: "Contatos", href: "/#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only run section detection on homepage
      if (pathname === "/") {
        const sections = document.querySelectorAll("section[id]");
        let currentSection = "/";

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = `/#${section.id}`;
          }
        });

        if (window.scrollY < 100) currentSection = "/";
        setActiveSection(currentSection);
      } else {
        // For other pages, active section is the pathname base
        if (pathname.startsWith("/produtos")) {
          setActiveSection("/produtos");
        } else {
          setActiveSection(pathname);
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Force white bg on non-home pages or when scrolled
  const isHome = pathname === "/";
  const headerBgClass =
    !isHome || isScrolled
      ? "bg-white/95 backdrop-blur-md shadow-md py-2"
      : "bg-transparent py-4";
  const linkColorClass =
    !isHome || isScrolled
      ? "text-text-main hover:text-primary-dark"
      : "text-white drop-shadow-md hover:text-white/80";
  const mobileToggleColor =
    !isHome || isScrolled || isMobileMenuOpen
      ? "text-primary-dark"
      : "text-white drop-shadow-md";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        headerBgClass,
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/logo-nobg.png"
            alt="Siloferr Peças Agrícolas"
            width={450}
            height={138}
            priority
            className={cn(
              "w-auto transition-all duration-300",
              !isHome || isScrolled ? "h-[5.6rem]" : "h-[6.9rem]",
            )}
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
                    activeSection === link.href
                      ? "text-primary font-bold"
                      : linkColorClass,
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300",
                    activeSection === link.href
                      ? "after:w-full"
                      : "after:w-0 hover:after:w-full",
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
            className="btn-accent px-5 py-2.5 text-sm shadow-lg hover:shadow-accent/50"
          >
            Solicitar Cotação
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className={cn("lg:hidden relative z-50 p-2", mobileToggleColor)}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 lg:hidden",
            isMobileMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none",
          )}
        >
          <nav className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-2xl font-heading font-bold",
                  activeSection === link.href
                    ? "text-primary"
                    : "text-text-main",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://api.whatsapp.com/send?phone=5543988032859"
              target="_blank"
              className="btn-accent px-8 py-3 text-lg mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solicitar Cotação
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
