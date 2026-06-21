import { useState, useRef, useEffect } from "react";
import { Zap, Target, Gauge, Award, Play, X } from "lucide-react";
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

  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bloqueia scroll do body quando modal aberto
  useEffect(() => {
    if (videoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [videoOpen]);

  // Fecha com Escape
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen]);

  const openVideo = () => setVideoOpen(true);

  const closeVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setVideoOpen(false);
  };

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

        {/* Máquina Dupla de Polir Piso */}
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
            {/* Thumbnail — button para tap correto no iOS */}
            <button
              type="button"
              aria-label="Assistir vídeo da Máquina Dupla de Polir Piso"
              onClick={openVideo}
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
              style={{ touchAction: "manipulation" }}
            >
              <img
                src={maquinaPolir}
                alt="Máquina Dupla de Polir Piso"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-background/30 group-hover:bg-background/20 transition-colors" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 active:scale-95 transition-transform shadow-xl">
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
                </div>
              </div>
            </button>

            {/* Fallback direto — especialmente útil no mobile */}
            <div className="mt-4 text-center">
              <a
                href={VIDEO_SRC}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary underline underline-offset-4 transition-colors"
              >
                📱 Abrir vídeo diretamente
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de vídeo — custom, compatível mobile/iOS ── */}
      {videoOpen && (
        /* Overlay: clique fora fecha */
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo: Máquina Dupla de Polir Piso"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={closeVideo}
        >
          {/* Container: clique dentro NÃO fecha */}
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              type="button"
              onClick={closeVideo}
              aria-label="Fechar vídeo"
              className="absolute -top-12 right-0 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white transition-colors"
              style={{ touchAction: "manipulation" }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Vídeo — playsInline: essencial iOS; sem autoPlay (mobile bloqueia) */}
            <video
              ref={videoRef}
              className="w-full rounded-xl bg-black"
              style={{ maxHeight: "75dvh" }}
              controls
              playsInline
              preload="metadata"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>

            {/* Fallback dentro do modal */}
            <p className="mt-3 text-center text-sm text-white/60">
              Vídeo não reproduziu?{" "}
              <a
                href={VIDEO_SRC}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                Abrir vídeo em nova aba
              </a>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default EquipmentSection;