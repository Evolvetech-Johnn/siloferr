"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Contact() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    
    // Simulate API Call for /api/contact
    setTimeout(() => {
      setFormState("success");
      const form = e.target as HTMLFormElement;
      form.reset();
      
      // Reset state after 5 seconds
      setTimeout(() => setFormState("idle"), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-dark mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
            Entre em Contato
          </h2>
          <p className="text-lg text-text-muted mt-8 leading-relaxed">
            Estamos prontos para atender você com a melhor solução em peças e equipamentos agrícolas. Preencha o formulário ou use nossos canais diretos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">
          
          {/* Info Sec */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-8"
          >
            <div className="group flex gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-dark mb-2">Localização</h3>
                <address className="text-slate-600 not-italic leading-relaxed">
                  Rua Antonina, 21 - Cambé - PR<br />
                  CEP 86188-570
                </address>
              </div>
            </div>

            <div className="group flex gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-dark mb-2">Telefones</h3>
                <div className="flex flex-col gap-1 text-slate-600">
                  <a href="tel:+554332534898" className="hover:text-primary transition-colors focus:outline-none focus:underline">(43) 3253-4898</a>
                  <a href="https://wa.me/5555439880328" target="_blank" rel="noreferrer" className="text-whatsapp hover:text-whatsapp-hover font-medium flex items-center gap-1.5 focus:outline-none focus:underline">
                    (43) 98803-2859 (Whatsapp)
                  </a>
                </div>
              </div>
            </div>

            <div className="group flex gap-5 items-start">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-dark mb-2">E-mail</h3>
                <div className="flex flex-col gap-1 text-slate-600">
                  <a href="mailto:vendas1@siloferr.com.br" className="hover:text-primary transition-colors focus:outline-none focus:underline">vendas1@siloferr.com.br</a>
                  <a href="mailto:vendas2@siloferr.com.br" className="hover:text-primary transition-colors focus:outline-none focus:underline">vendas2@siloferr.com.br</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Sec */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">Nome completo</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      required 
                      disabled={formState === "loading"}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">E-mail</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      required 
                      disabled={formState === "loading"}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="Ex: joao@email.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-slate-700">Assunto</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject" 
                    required 
                    disabled={formState === "loading"}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">Mensagem</label>
                  <textarea 
                    id="message"
                    name="message" 
                    rows={5} 
                    required 
                    disabled={formState === "loading"}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 resize-none disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="Descreva sua necessidade..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={formState === "loading" || formState === "success"}
                  className={cn(
                    "btn w-full py-4 text-lg justify-center mt-2 disabled:cursor-not-allowed",
                    formState === "success" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "btn-primary",
                    formState === "error" ? "bg-red-500 hover:bg-red-600 text-white" : ""
                  )}
                >
                  {formState === "idle" && (
                    <>Enviar Mensagem <Send size={20} className="ml-2" /></>
                  )}
                  {formState === "loading" && (
                    <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Enviando...</>
                  )}
                  {formState === "success" && (
                    <>Mensagem Enviada! <CheckCircle2 size={20} className="ml-2" /></>
                  )}
                  {formState === "error" && (
                    <>Erro ao enviar <AlertCircle size={20} className="ml-2" /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
