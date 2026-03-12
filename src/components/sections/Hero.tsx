"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    image: "https://siloferr.com.br/Content/img/intro-carousel/1.jpg",
    title: "Engenharia de Precisão e\nAlta Performance",
    subtitle: "Soluções industriais sob medida para o agronegócio de elite.",
    primaryAction: {
      label: "Falar com Especialista",
      href: "https://api.whatsapp.com/send?phone=5543988032859",
      icon: "whatsapp",
    },
  },
  {
    id: 2,
    image: "https://siloferr.com.br/Content/img/intro-carousel/4.jpg",
    title: "Inovação Robusta em\nArmazenagem",
    subtitle: "Tecnologia de ponta com durabilidade extrema e garantia premium.",
    primaryAction: {
      label: "Explorar Catálogo",
      href: "#products",
    },
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section id="hero" className="relative w-full h-[100svh] min-h-[600px] bg-slate-900 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {SLIDES.map((slide, index) => {
          if (index !== currentSlide) return null;

          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/70 to-black/80" />
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="container-custom max-w-4xl">
                  <motion.h2
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl text-white font-heading font-black mb-8 leading-[1.1] tracking-tight whitespace-pre-line"
                  >
                    {slide.title.split('\n').map((line, i) => (
                      <span key={i} className="block">
                        {line}
                        {i === 0 && <span className="text-accent">.</span>}
                      </span>
                    ))}
                  </motion.h2>

                  {slide.subtitle && (
                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                      className="text-xl md:text-2xl text-silver mb-12 drop-shadow-md font-medium max-w-2xl mx-auto"
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  >
                    {slide.primaryAction.icon === "whatsapp" ? (
                      <a href={slide.primaryAction.href} target="_blank" rel="noreferrer" className="btn-accent px-10 py-5 text-lg">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.112.551 4.167 1.597 5.975L.031 23.97l6.115-1.579C7.876 23.361 9.941 24 12.031 24c6.646 0 12.031-5.386 12.031-12.031C24.062 5.386 18.677 0 12.031 0zm0 22.012c-1.841 0-3.647-.492-5.232-1.424l-.375-.221-3.89 1.004 1.025-3.79-.243-.386C2.333 15.485 1.77 13.784 1.77 12.031 1.77 6.37 6.37 1.77 12.031 1.77c5.66 0 10.26 4.6 10.26 10.26 0 5.66-4.6 10.26-10.26 10.26zM17.67 15.35c-.31-.155-1.841-.91-2.127-1.014-.286-.104-.492-.155-.7.155-.207.31-.8 1.014-.98 1.22-.18.207-.36.232-.67.078-.31-.155-1.314-.486-2.504-1.547-.928-.826-1.554-1.846-1.734-2.155-.18-.31-.02-.477.135-.63.14-.14.31-.36.465-.54.155-.18.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.155-.7-1.685-.959-2.308-.252-.605-.508-.523-.7-.532-.18-.008-.387-.01-.594-.01-.207 0-.543.078-.827.388-.284.31-1.085 1.06-1.085 2.585 0 1.525 1.11 3 1.265 3.208.155.207 2.186 3.336 5.297 4.678 3.111 1.342 3.111.896 3.68.844.569-.052 1.841-.752 2.1-1.477.258-.725.258-1.348.18-1.477-.078-.13-.284-.207-.594-.362z" />
                        </svg>
                        {slide.primaryAction.label}
                      </a>
                    ) : (
                      <a href={slide.primaryAction.href} className="btn-outline border-silver px-10 py-5 text-lg bg-white/5 backdrop-blur-sm hover:bg-white hover:text-primary transition-all">
                        {slide.primaryAction.label}
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-20 pointer-events-none">
        <button
          onClick={handlePrev}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Próximo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-12 h-1.5 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-accent" : "bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
