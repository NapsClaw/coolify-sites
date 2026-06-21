import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

// Import client logos
import ancoraLogo from "@/assets/clients/ancora-chumbadores.webp";
import arqplastLogo from "@/assets/clients/arqplast.jpg";
import arthiLogo from "@/assets/clients/arthi.jpg";
import brAluminioLogo from "@/assets/clients/br-aluminio.jpg";
import casteloLogo from "@/assets/clients/castelo-alimentos.png";
import chaplinLogo from "@/assets/clients/chaplin.png";
import construtoraLogo from "@/assets/clients/construtora-bema.webp";
import dallasLogo from "@/assets/clients/dallas-alimentos.png";
import divertoysLogo from "@/assets/clients/divertoys.jpg";
import eduartsLogo from "@/assets/clients/eduarts.png";
import extremoSulLogo from "@/assets/clients/extremo-sul.png";
import ferroAcoLogo from "@/assets/clients/ferro-aco-carmo.jpeg";
import forceLineLogo from "@/assets/clients/force-line.webp";
import grupoMeggaLogo from "@/assets/clients/grupo-megga.jpg";
import kiaLogo from "@/assets/clients/kia-motors.jpg";
import luigiContiniLogo from "@/assets/clients/luigi-contini.jpg";
import mastiflexLogo from "@/assets/clients/mastiflex.jpg";
import najaLogo from "@/assets/clients/naja-baterias.gif";
import polimetLogo from "@/assets/clients/polimet.png";
import serralheriaLogo from "@/assets/clients/serralheria-dois-irmaos.jpeg";
import grupoToniatoLogo from "@/assets/clients/grupo-toniato.jpg";
import plpLogo from "@/assets/clients/plp.png";
import supermercadoBoaLogo from "@/assets/clients/supermercado-boa.png";
import supermercadoEstrelaLogo from "@/assets/clients/supermercado-estrela.png";
import unistampLogo from "@/assets/clients/unistamp.jpg";

interface Client {
  name: string;
  location: string;
  logo?: string;
}

const ClientsSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();

  const clients: Client[] = [
    { name: "Transportadora Grupo Toniato", location: "São Paulo-SP", logo: grupoToniatoLogo },
    { name: "Supermercado Boa", location: "Jundiaí/Várzea e Itupeva-SP", logo: supermercadoBoaLogo },
    { name: "Âncora Chumbadores", location: "Valinhos-SP", logo: ancoraLogo },
    { name: "Arqplast Utilidades e Brinquedos", location: "Boituva-SP", logo: arqplastLogo },
    { name: "Arthi Comercial Ltda.", location: "Bom Jesus dos Perdões-SP", logo: arthiLogo },
    { name: "BR Alumínio Ltda.", location: "Cabreúva-SP", logo: brAluminioLogo },
    { name: "Castelo Alimentos S/A", location: "Jundiaí-SP", logo: casteloLogo },
    { name: "Chaplin Administração e Corretagem", location: "Itupeva-SP", logo: chaplinLogo },
    { name: "Construtora Bema Ltda", location: "10 lojas Walmart", logo: construtoraLogo },
    { name: "Dallas Alimentos", location: "Cabreúva-SP", logo: dallasLogo },
    { name: "Divertoys", location: "Laranjal Pta-SP", logo: divertoysLogo },
    { name: "Eduarts", location: "Elias Fausto-SP", logo: eduartsLogo },
    { name: "Extremo Sul", location: "Extrema-MG", logo: extremoSulLogo },
    { name: "Ferro e Aço Nossa Senhora do Carmo", location: "São Paulo-SP", logo: ferroAcoLogo },
    { name: "Force Line", location: "Extrema-MG", logo: forceLineLogo },
    { name: "Grupo Megga", location: "Cabreúva-SP", logo: grupoMeggaLogo },
    { name: "Kia Motors", location: "Itu-SP", logo: kiaLogo },
    { name: "Luigi Contini", location: "São Paulo", logo: luigiContiniLogo },
    { name: "Mastiflex Ind. e Comércio Ltda.", location: "Mauá", logo: mastiflexLogo },
    { name: "Naja Baterias", location: "Extrema", logo: najaLogo },
    { name: "PLP", location: "Cajamar-SP", logo: plpLogo },
    { name: "Polimet", location: "Boituva-SP", logo: polimetLogo },
    { name: "Serralheria Dois Irmãos", location: "Mogi Guaçu", logo: serralheriaLogo },
    { name: "Supermercado Estrela", location: "Santana de Parnaíba-SP", logo: supermercadoEstrelaLogo },
    { name: "Unistamp", location: "Jarinu-SP", logo: unistampLogo },
    { name: "Ibanez Pallets", location: "Monte Mor-SP" },
  ];

  const { setRef, visibleItems } = useScrollRevealMultiple(clients.length, { rootMargin: "0px 0px -30px 0px" });

  return (
    <section id="clientes" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span className="inline-block text-gradient-cyan font-medium mb-4 tracking-wider text-sm uppercase">
            Parceiros
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="text-foreground">Clientes que </span>
            <span className="text-gradient-cyan">confiam</span>
            <span className="text-foreground"> na JCarlos Pisos Industriais!</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clients.map((client, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={cn(
                "rounded-xl p-4 text-center hover:border-primary/50 transition-all group border",
                client.logo 
                  ? "bg-white border-gray-200" 
                  : "bg-card border-border",
                visibleItems[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{
                transitionDelay: visibleItems[index] ? `${(index % 8) * 50}ms` : "0ms",
                transitionDuration: "400ms",
                transitionProperty: "opacity, transform"
              }}
            >
              {client.logo ? (
                <div className="h-20 flex items-center justify-center">
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-20 flex flex-col items-center justify-center">
                  <p className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors">
                    {client.name}
                  </p>
                  <p className="text-foreground/60 text-xs mt-1">
                    {client.location}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;