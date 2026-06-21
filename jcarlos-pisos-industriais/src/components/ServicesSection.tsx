import { Layers, Shield, Droplets, Wrench, Grid3X3, Paintbrush } from "lucide-react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const ServicesSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { setRef, visibleItems } = useScrollRevealMultiple(6, { rootMargin: "0px 0px -50px 0px" });
  const { ref: additionalRef, isVisible: additionalVisible } = useScrollReveal();

  const services = [
    {
      icon: Layers,
      title: "Piso Protendido",
      description: "Execução de pisos protendidos com tecnologia de ponta para grandes áreas."
    },
    {
      icon: Grid3X3,
      title: "Piso em Concreto",
      description: "Piso em concreto estrutural ou monolítico, com ou sem fibras."
    },
    {
      icon: Shield,
      title: "Fibras de Aço e Sintéticas",
      description: "Fibras estruturais de aço, sintéticas e de vidro para retração do concreto."
    },
    {
      icon: Wrench,
      title: "Tratamento de Juntas",
      description: "Tratamento especializado das juntas de dilatação."
    },
    {
      icon: Droplets,
      title: "Cura Química - RAD",
      description: "Revestimento de alto desempenho com cura química profissional."
    },
    {
      icon: Paintbrush,
      title: "Resinas e Pintura Epóxi",
      description: "Aplicação de resinas em geral e pintura epóxi com ou sem cor."
    },
  ];

  const additionalServices = [
    "Endurecedor de superfície químico e mineral",
    "Fibras estruturais tipo PP",
    "Telas eletrosoldadas Gerdau",
    "Barras de transferência",
    "Treliças",
  ];

  return (
    <section id="servicos" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span className="inline-block text-gradient-cyan font-medium mb-4 tracking-wider text-sm uppercase">
            O que oferecemos
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-cyan">
            Nossos Serviços
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={cn(
                "bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all group hover:-translate-y-1",
                visibleItems[index]
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-12 scale-95"
              )}
              style={{
                transitionDelay: visibleItems[index] ? `${index * 80}ms` : "0ms",
                transitionDuration: "500ms",
                transitionProperty: "opacity, transform"
              }}
            >
              <div className="w-14 h-14 bg-gradient-cyan rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-background" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-foreground/60 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div
          ref={additionalRef}
          className={cn(
            "bg-card border border-border rounded-2xl p-8 transition-all duration-700",
            additionalVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h3 className="text-xl font-display font-semibold text-gradient-cyan mb-6 text-center">
            Também trabalhamos com
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {additionalServices.map((service, index) => (
              <span
                key={index}
                className="px-5 py-2.5 bg-secondary border border-border rounded-full text-foreground/80 text-sm hover:border-primary/50 transition-colors"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;