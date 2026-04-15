
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Serviços', href: '#' },
    { name: 'Como Funciona', href: '#' },
    { name: 'Preços', href: '#' },
    { name: 'Sobre Nós', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  const LOGO_URL = "https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png";

  return (
    <header className="bg-white py-3 border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo - Aumentada em 100% em relação à versão anterior */}
        <div className="flex items-center">
          <a href="/" className="transition-all hover:opacity-90 active:scale-95 flex items-center">
            <img 
              src={LOGO_URL} 
              alt="Agilprev Logo" 
              className="h-[90px] md:h-[108px] w-auto object-contain transition-all duration-300" 
              style={{ 
                imageRendering: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.02))'
              }}
            />
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-[14px] font-semibold text-gray-600">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="hover:text-agil-blue transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-agil-blue transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Action Button & Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenModal}
            className="hidden sm:flex bg-agil-green text-white px-6 py-2.5 rounded-xl text-sm font-bold items-center gap-2 hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-green-500/20"
          >
            <span>Resolver meu caso</span>
          </button>
          
          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 text-agil-blue hover:bg-blue-50 transition-colors relative z-[110]"
            aria-label="Alternar menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-3xl z-[90] lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full p-8 pt-24 overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-8">
            {navLinks.map((link, idx) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-3xl font-extrabold text-white flex items-center justify-between group transition-all duration-500 delay-${idx * 100} ${
                  isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight size={28} className="text-white/40 group-hover:text-agil-yellow transition-all" />
              </a>
            ))}
          </nav>

          {/* CTA & Contact Information */}
          <div className={`mt-12 transition-all duration-700 delay-500 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button 
              onClick={() => { setIsMenuOpen(false); onOpenModal(); }}
              className="w-full bg-agil-green text-white py-6 rounded-[1.5rem] font-black text-xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)] hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Resolver meu caso agora
            </button>
            
            <div className="mt-16 pt-10 border-t border-white/10 text-center">
              <p className="text-white/60 text-xs font-bold mb-4 uppercase tracking-[0.15em]">Fale conosco pelo WhatsApp</p>
              <a 
                href="https://wa.me/5511972430392" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-white text-4xl font-black hover:text-agil-green transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                (11) 97243-0392
              </a>
            </div>
          </div>
          
          {/* Bottom Logo - White Inverted */}
          <div className="mt-auto pt-12 flex justify-center opacity-60">
             <img 
               src={LOGO_URL} 
               className="h-15 w-auto brightness-0 invert" 
               alt="Agilprev" 
             />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
