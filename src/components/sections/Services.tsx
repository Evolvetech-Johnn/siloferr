"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Warehouse } from "lucide-react";

const SERVICES = [
  {
    id: 1,
    title: "Instalação de Correias",
    description: "Profissionais especializados na realização de serviços de instalação e emendas de correias transportadoras e elevadoras com precisão milimétrica.",
    icon: Wrench,
  },
  {
    id: 2,
    title: "Adequação Norma NR 12",
    description: "Adequamos seus equipamentos às mais rigorosas exigências da norma NR 12, garantindo total segurança e tranquilidade operacional.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Reforma de Silos",
    description: "Reformas estruturais e ampliações de silos visando a otimização de espaço e o aumento substancial da capacidade de armazenamento.",
    icon: Warehouse,
  }
];

export function Services() {
  return (
    <section id="services" className="section-padding bg-white relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent font-bold tracking-wider uppercase text-sm mb-3 block">Excelência em Atendimento</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-dark mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
            Nossos Serviços
          </h2>
          <p className="text-lg text-text-muted mt-8 leading-relaxed">
            Soluções completas e especializadas para garantir a máxima eficiência, produtividade e conformidade do seu agronegócio e indústria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <div className="group bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,86,179,0.12)] transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                {/* Hover Background Fill */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                    <service.icon size={36} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold text-primary-dark group-hover:text-white mb-4 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-600 group-hover:text-white/90 leading-relaxed transition-colors duration-300 flex-grow">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
