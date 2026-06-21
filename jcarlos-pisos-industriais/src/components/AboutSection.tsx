import { Award, Building2, MapPin, Users } from "lucide-react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const AboutSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { setRef, visibleItems } = useScrollRevealMultiple(4, { rootMargin: "0px 0px -50px 0px" });

  const stats = [
    { icon: Award, value: "20+", label: "Anos de Experiência" },
    { icon: Building2, value: "500+", label: "Projetos Realizados" },
    { icon: MapPin, value: "Brasil", label: "Atuação Nacional" },
    { icon: Users, value: "100+", label: "Clientes Satisfeitos" },
  ];

  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            ref={titleRef}
            className={cn(
              "transition-all duration-700",
              titleVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
          >
            <span className="inline-block text-gradient-cyan font-medium mb-4 tracking-wider text-sm uppercase">
              Sobre a Empresa
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Com mais de</span>
              <br />
              <span className="text-gradient-cyan">20 anos</span>
              <span className="text-foreground"> no mercado</span>
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              JCarlos Pisos Industriais é uma empresa especializada em pisos industriais e revestimentos de alto desempenho, utilizando-se de equipamentos e materiais de alta performance, de acordo com as exigências e necessidades de cada cliente, atuando em todo território nacional.
            </p>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Atendemos os principais segmentos com um compromisso fixado com a excelência e a inovação, garantindo qualidade superior em cada projeto executado.
            </p>
            <a
              href="#servicos"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-gradient-cyan hover:text-background hover:border-transparent transition-all"
            >
              Nossos Serviços
            </a>
          </div>

          {/* Right - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                ref={setRef(index)}
                className={cn(
                  "bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all group",
                  visibleItems[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
                style={{
                  transitionDelay: visibleItems[index] ? `${index * 100}ms` : "0ms",
                  transitionDuration: "600ms",
                  transitionProperty: "opacity, transform"
                }}
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-display font-bold text-gradient-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;