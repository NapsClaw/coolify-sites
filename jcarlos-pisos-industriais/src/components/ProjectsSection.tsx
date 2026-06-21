import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

import projeto1 from "@/assets/projeto-1.jpeg";
import projeto2 from "@/assets/projeto-2.jpeg";
import projeto3 from "@/assets/projeto-3.jpeg";
import projeto4 from "@/assets/projeto-4.jpeg";
import projeto5 from "@/assets/projeto-5.jpeg";
import projeto6 from "@/assets/projeto-6.jpeg";
import projeto7 from "@/assets/projeto-7.jpeg";
import projeto8 from "@/assets/projeto-8.jpeg";
import projeto9 from "@/assets/projeto-9.jpeg";

const ProjectsSection = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();

  const projects = [
    { image: projeto1, title: "Piso Industrial Acabado", location: "Galpão Industrial" },
    { image: projeto2, title: "Supermercado Boa", location: "Jundiaí - SP" },
    { image: projeto3, title: "Piso com Laser", location: "Centro Logístico" },
    { image: projeto4, title: "Galpão em Construção", location: "São Paulo - SP" },
    { image: projeto5, title: "Vista Aérea", location: "Complexo Industrial" },
    { image: projeto6, title: "Piso Finalizado", location: "Centro de Distribuição" },
    { image: projeto7, title: "Galpão Industrial", location: "Cabreúva - SP" },
    { image: projeto8, title: "Fachada Industrial", location: "Jundiaí - SP" },
    { image: projeto9, title: "Piso em Execução", location: "Área Industrial" },
  ];

  const { setRef, visibleItems } = useScrollRevealMultiple(projects.length, { rootMargin: "0px 0px -50px 0px" });

  const openModal = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev! + 1) % projects.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev! - 1 + projects.length) % projects.length);
    }
  };

  return (
    <section id="projetos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={cn(
            "text-center mb-12 transition-all duration-700",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span className="inline-block text-gradient-cyan font-medium mb-4 tracking-wider text-sm uppercase">
            Portfólio
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-foreground">Confira alguns dos</span>
            <br />
            <span className="text-gradient-cyan">nossos projetos!</span>
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <div
              key={index}
              ref={setRef(index)}
              onClick={() => openModal(index)}
              className={cn(
                "relative group rounded-xl overflow-hidden cursor-pointer aspect-square",
                visibleItems[index]
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-12 scale-95"
              )}
              style={{
                transitionDelay: visibleItems[index] ? `${(index % 6) * 80}ms` : "0ms",
                transitionDuration: "600ms",
                transitionProperty: "opacity, transform"
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Hover Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-foreground font-semibold text-sm md:text-base">
                  {project.title}
                </h3>
                <p className="text-foreground/60 text-xs md:text-sm">{project.location}</p>
              </div>

              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-gradient-cyan flex items-center justify-center">
                  <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors z-10"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>

          {/* Navigation - Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] relative"
          >
            <img
              src={projects[selectedImage].image}
              alt={projects[selectedImage].title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 rounded-b-lg">
              <h3 className="text-foreground font-display text-xl font-semibold">
                {projects[selectedImage].title}
              </h3>
              <p className="text-foreground/60">{projects[selectedImage].location}</p>
              <p className="text-primary text-sm mt-2">
                {selectedImage + 1} / {projects.length}
              </p>
            </div>
          </div>

          {/* Navigation - Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;