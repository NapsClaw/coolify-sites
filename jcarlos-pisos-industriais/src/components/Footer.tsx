import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";

const Footer = () => {
  return <footer id="contato" className="bg-background">
      {/* Map */}
      <div className="w-full h-[400px]">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.9197261236154!2d-46.8861942!3d-23.2095959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf26b682333a49%3A0x14ebe3eb641fe6f2!2sR.%20Clodoaldo%20Francisco%20P%C3%B3li%2C%2084%20-%20Vianelo%2FBonfiglioli%2C%20Jundia%C3%AD%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1764867034952!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{
        border: 0
      }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale hover:grayscale-0 transition-all duration-500" />
      </div>

      {/* Footer Content */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <img alt="JCarlos Pisos Industriais" className="h-16 mb-6" src="/lovable-uploads/afe115cf-4abf-496f-b30c-79aadb15b2fe.webp" />
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
                    Rua Clodoaldo Francisco Polli, n°84
                    <br />
                    Parque União – CEP: 13206-651
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
                  <a href="mailto:contato@jcarlospisosindustriais.com.br" className="text-foreground/70 text-sm hover:text-primary transition-colors">
                    contato@jcarlospisosindustriais.com.br
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
                  8h às 12h – 13:30h às 18h
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