import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [{
    label: "Início",
    href: "#hero"
  }, {
    label: "Sobre",
    href: "#sobre"
  }, {
    label: "Equipamentos",
    href: "#equipamentos"
  }, {
    label: "Serviços",
    href: "#servicos"
  }, {
    label: "Projetos",
    href: "#projetos"
  }, {
    label: "Clientes",
    href: "#clientes"
  }, {
    label: "Contato",
    href: "#contato"
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center">
          <img alt="JCarlos Pisos Industriais" className="h-14 md:h-16 w-auto" src="/logo-jcarlos.svg" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => <a key={link.href} href={link.href} className="text-foreground/80 hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide">
              {link.label}
            </a>)}
        </nav>

        {/* WhatsApp Button */}
        <a href="https://wa.me/5511995662308" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-gradient-cyan text-white px-5 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
          Fale Conosco
        </a>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map(link => <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-foreground/80 hover:text-primary transition-colors py-2 text-sm font-medium">
                {link.label}
              </a>)}
            <a href="https://wa.me/5511995662308" target="_blank" rel="noopener noreferrer" className="bg-gradient-cyan text-white px-5 py-3 rounded-full font-medium text-sm text-center mt-2">
              Fale Conosco
            </a>
          </nav>
        </div>}
    </header>;
};
export default Header;