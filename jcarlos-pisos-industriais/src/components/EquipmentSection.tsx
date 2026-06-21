import { Zap, Target, Gauge, Award } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import laserScreed from "@/assets/laser-screed.jpeg";
import maquinaPolir from "@/assets/maquina-polir.png";

const VIDEO_SRC = "/videos/maquina-polir.mp4";

const EquipmentSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal();
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal();
  const { ref: polishRef, isVisible: polishVisible } = useScrollReveal();

  const benefits = [
    {
      icon: Target,
      title: "Precisão Milimétrica",
      description: "Feixe de laser garante nivelamento perfeito"
    },
    {
      icon: Zap,
      title: "Alta Produtividade",
      description: "Execução até 10x mais rápida que métodos tradicionais"
    },
    {
      icon: Gauge,
      title: "Eficiência Superior",
      description: "Compactação e alisamento automatizados"
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Acabamento impecável em grandes áreas"
    },
  ];

  return (
    <section id="equipamentos" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span className="inline-block text-gradient-cyan font-medium mb-4 tracking-wider text-sm uppercase">
            Tecnologia de Ponta
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-foreground">Usamos os </span>
            <span className="text-gradient-cyan">melhores equipamentos</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            ref={imageRef}
            className={cn(
              "relative transition-all duration-700",
              imageVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            )}
          >
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={laserScreed}
                alt="Laser Screed - Equipamento de última geração"
                className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-xl p-4">
                  <h3 className="text-gradient-cyan font-display text-2xl font-bold mb-1">
                    Laser Screed
                  </h3>
                  <p className="text-foreground/80 text-sm">
                    A revolução em pisos industriais
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className={cn(
              "transition-all duration-700 delay-200",
              contentVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            )}
          >
            <h3 className="font-display text-3xl font-bold text-foreground mb-6">
              Laser Screed: <span className="text-gradient-cyan">Precisão Absoluta</span>
            </h3>
            
            <p className="text-foreground/70 text-lg leading-relaxed mb-6">
              Laser Screed é uma máquina de construção civil que <strong className="text-foreground">automatiza o nivelamento e a compactação</strong> de pisos de concreto, usando um feixe de laser para garantir precisão milimétrica e uma régua vibratória para alisar o concreto.
            </p>
            
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Ela revoluciona a execução de pisos de grandes áreas, <strong className="text-foreground">aumentando a produtividade, a qualidade e a eficiência</strong> em comparação aos métodos tradicionais.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
                >
                  <benefit.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="text-foreground font-semibold text-sm mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-foreground/60 text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Máquina Dupla de Polir Piso — player inline */}
        <div
          ref={polishRef}
          className={cn(
            "mt-24 text-center transition-all duration-700",
            polishVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Máquina Dupla de Polir Piso
          </h3>

          <div className="max-w-3xl mx-auto">
            {/*
              Player inline: controls nativos + playsInline para iOS não fullscreen.
              SEM autoPlay — usuário inicia com toque/clique.
              poster = thumbnail da máquina enquanto o vídeo não carrega.
              preload="metadata" carrega apenas metadados (duração/dimensão),
              evitando consumo de dados desnecessário antes do play.
            */}
            <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/50 ring-1 ring-primary/20">
              <video
                controls
                playsInline
                preload="metadata"
                poster={maquinaPolir}
                className="w-full block"
                style={{ aspectRatio: "16/9", maxHeight: "500px", objectFit: "contain" }}
                aria-label="Vídeo da Máquina Dupla de Polir Piso"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
                {/* Fallback para browsers muito antigos sem suporte a <video> */}
                <a href={VIDEO_SRC} className="text-primary underline">
                  Abrir vídeo
                </a>
              </video>
            </div>

            {/* Fallback discreto — caminho secundário, não principal */}
            <p className="mt-3 text-xs text-foreground/35">
              Se o vídeo não carregar,{" "}
              <a
                href={VIDEO_SRC}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary transition-colors"
              >
                abrir diretamente →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;