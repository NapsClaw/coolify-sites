import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";

const Footer = () => {
  return <footer id="contato" className="bg-background">
      {/* Map */}
      <div className="w-full h-[400px]">
        <iframe src="https://maps.google.com/maps?q=R.+L%C3%ADbia%2C+13%2C+Vianelo+Bonfiglioli%2C+Jundia%C3%AD%2C+SP%2C+13207-370&hl=pt-BR&z=17&output=embed" width="100%" height="100%" style={{
        border: 0
      }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale hover:grayscale-0 transition-all duration-500" />
      </div>

      {/* Footer Content */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <img alt="JCarlos Pisos Industriais" className="h-14 w-auto mb-6" src="/logo-jcarlos.svg" />
              <p className="text-foreground/60 text-sm leading-relaxed">
                JCarlos Pisos Industriais — especialistas em pisos industriais e revestimentos de alto desempenho há mais de 20 anos.
              </p>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-gradient-cyan font-display font-semibold text-lg mb-6">
                Localização
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/70 text-sm">
                    R. Líbia, 13 – Sala 4
                    <br />
                    Vianelo/Bonfiglioli – CEP: 13207-370
                    <br />
                    Jundiaí – SP
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-gradient-cyan font-display font-semibold text-lg mb-6">
                Contato
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="https://wa.me/5511995662308" target="_blank" rel="noopener noreferrer" className="text-foreground/70 text-sm hover:text-primary transition-colors">
                    (11) 99566-2308
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:comercial@jcarlos.com.br" className="text-foreground/70 text-sm hover:text-primary transition-colors">
                    comercial@jcarlos.com.br
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-gradient-cyan font-display font-semibold text-lg mb-6">
                Horário de Atendimento
              </h4>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground/70 text-sm">
                  Segunda a Sexta
                  <br />
                  a partir das 08h00
                </p>
              </div>
              
              {/* Social */}
              <div className="mt-6">
                <a href="https://www.instagram.com/jcarlospisosindustriais/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm">@jcarlospisosindustriais</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-foreground/50 text-sm">
              © {new Date().getFullYear()} JCarlos Pisos Industriais. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;