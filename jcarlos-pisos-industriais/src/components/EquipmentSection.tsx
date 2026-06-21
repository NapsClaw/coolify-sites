import { useState } from "react";
import { Zap, Target, Gauge, Award, Play, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import laserScreed from "@/assets/laser-screed.jpeg";
import maquinaPolir from "@/assets/maquina-polir.png";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const EquipmentSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal();
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal();
  const { ref: polishRef, isVisible: polishVisible } = useScrollReveal();
  
  const [videoOpen, setVideoOpen] = useState(false);

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
            <div 
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setVideoOpen(true)}
            >
              <img
                src={maquinaPolir}
                alt="Máquina Dupla de Polir Piso"
                className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-background/30 group-hover:bg-background/20 transition-colors" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background border-border overflow-hidden">
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <video
            src="/videos/maquina-polir.mp4"
            controls
            autoPlay
            className="w-full h-auto max-h-[80vh]"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EquipmentSection;