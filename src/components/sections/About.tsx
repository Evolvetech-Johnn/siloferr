"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

const FEATURES = [
  {
    title: "Equipamentos",
    iconSrc: "https://siloferr.com.br/Content/img/folder.png",
    items: [
      "Elevador de Canecas",
      "Silos planos e elevados",
      "Secador de Grãos",
      "Roscas e Fitas transportadoras"
    ]
  },
  {
    title: "Correias e Canecas",
    iconSrc: "https://siloferr.com.br/Content/img/folder2.png",
    highlight: true,
    items: [
      "Correias elevadoras 04 a 08 lonas",
      "Correias taliscadas e corrugadas",
      "Canecas em PEAD, Nylon e Metal",
      "Correia Transportadora Completa"
    ]
  },
  {
    title: "Acessórios",
    iconSrc: "https://siloferr.com.br/Content/img/folder.png",
    items: [
      "Tubos e Válvulas bifurcadas",
      "Curvas em chapa e ferro fundido",
      "Pisos perfurados p/ aeração",
      "Peneiras para pré-limpeza"
    ]
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export function About() {
  return (
    <section id="about" className="section-padding bg-bg-alt relative">
      <div className="container-custom">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-dark mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
            Sobre a Siloferr
          </h2>
          <p className="text-lg text-text-muted mt-8 leading-relaxed">
            A Siloferr é uma empresa Paranaense situada em Cambé-PR com mais de 15 anos de experiência na construção de silos, fornecendo suporte, equipamentos e acessórios para toda cadeia do agronegócio. Nossos projetos são feitos com excelência e foco na sua necessidade.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full">
              <div 
                className={`h-full p-8 md:p-10 rounded-2xl border transition-all duration-300 relative overflow-hidden group 
                  ${feature.highlight 
                    ? "bg-gradient-to-br from-primary to-primary-dark border-primary-light shadow-[0_15px_40px_rgba(0,86,179,0.2)] text-white hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,86,179,0.3)]" 
                    : "bg-white border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-text-main hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
                  }`}
              >
                {/* Background Decorator */}
                {feature.highlight && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500
                    ${feature.highlight ? "bg-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.1)]" : "bg-bg-alt shadow-sm"}
                  `}>
                    <Image 
                      src={feature.iconSrc} 
                      alt={feature.title} 
                      width={45} 
                      height={45} 
                      className={`object-contain relative z-10 ${feature.highlight ? "brightness-0 invert" : ""}`}
                    />
                  </div>
                  
                  <h3 className={`text-2xl font-heading font-bold mb-6 ${feature.highlight ? "text-white" : "text-primary-dark"}`}>
                    {feature.title}
                  </h3>
                  
                  <ul className="w-full text-left space-y-4">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check 
                          className={`w-5 h-5 shrink-0 mt-0.5 ${feature.highlight ? "text-accent" : "text-accent"}`} 
                          strokeWidth={3}
                        />
                        <span className={`font-medium leading-tight ${feature.highlight ? "text-white/90" : "text-slate-600"}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
