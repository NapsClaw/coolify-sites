import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center video-container">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up">
          <span className="text-gradient-cyan">Há 20 anos</span>
          <br />
          <span className="text-foreground">deixando o mundo</span>
          <br />
          <span className="text-foreground">aos seus pés.</span>
        </h1>
        
        <p className="text-foreground/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Oferecemos para o mercado da construção civil, serviços de execução de pisos de alta qualidade e entendemos que nosso trabalho deve ser exercido de maneira simples e eficiente com qualidade e facilidade de pagamento.
        </p>

        <a
          href="#sobre"
          className="inline-flex items-center gap-2 bg-gradient-cyan text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Conheça a JCarlos Pisos Industriais
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="text-primary w-8 h-8" />
      </div>
    </section>
  );
};

export default HeroSection;