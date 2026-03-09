"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, ChevronRight, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white/80">
      <div className="container-custom pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <Link href="#hero" className="inline-block mb-6">
              <Image
                src="/logo-nobg.png"
                alt="Siloferr Logo"
                width={160}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="leading-relaxed mb-6 pe-4 text-white/70">
              Especializada em oferecer as melhores soluções para armazenamento,
              transporte e beneficiamento de produtos agrícolas com mais de 15
              anos de excelência.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/siloferr/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:-translate-y-1 transition-all duration-300 focus:ring-2 focus:ring-accent outline-none"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/siloferr/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:-translate-y-1 transition-all duration-300 focus:ring-2 focus:ring-accent outline-none"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xl font-heading font-semibold text-white mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Links Úteis
            </h4>
            <ul className="flex flex-col gap-3">
              {["Home", "Sobre a Empresa", "Nossos Serviços", "Produtos"].map(
                (item, idx) => {
                  const href =
                    item === "Home"
                      ? "#hero"
                      : item === "Sobre a Empresa"
                        ? "#about"
                        : item === "Nossos Serviços"
                          ? "#services"
                          : "#products";
                  return (
                    <li key={idx}>
                      <Link
                        href={href}
                        className="flex items-center gap-2 hover:text-white transition-colors group"
                      >
                        <ChevronRight
                          size={14}
                          className="text-accent transition-transform group-hover:translate-x-1"
                        />
                        {item}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-xl font-heading font-semibold text-white mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Fique por dentro
            </h4>
            <p className="mb-6 text-white/70">
              Assine nossa newsletter para receber as últimas novidades e
              ofertas de equipamentos.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-4 py-3 rounded-l-md focus:outline-none focus:bg-white/20 focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover px-5 flex items-center justify-center rounded-r-md transition-colors focus:ring-2 focus:ring-accent outline-none focus:ring-offset-2 focus:ring-offset-primary-dark"
                aria-label="Assinar Newsletter"
              >
                <Mail size={18} className="text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="bg-black/20 py-6 border-t border-white/10">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <strong className="text-white">Siloferr Peças Agrícolas</strong>.
            Todos os direitos reservados.
          </p>
          <p>Feito com tecnologia Premium.</p>
        </div>
      </div>
    </footer>
  );
}
