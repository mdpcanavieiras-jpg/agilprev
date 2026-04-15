
import React, { useState, useEffect, useCallback } from 'react';
import { Star as LucideStar, ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const testimonials = [
    {
      name: "Roberto Almeida",
      role: "Revisão de Valor",
      rating: 5,
      text: '"Minha aposentadoria veio com valor errado. Usei a análise inteligente da <span class=\'text-logo-green\'>Agil</span><span class=\'text-logo-blue\'>prev</span> para identificar o erro de cálculo e ganhei a revisão."',
      // Homem meia idade, sorrindo (Top Left do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho2.png"
    },
    {
      name: "Luciana Lima",
      role: "Aposentadoria Especial",
      rating: 5,
      text: '"Trabalhei anos em condições insalubres e o INSS nunca reconhecia meu tempo. A <span class=\'text-logo-green\'>Agil</span><span class=\'text-logo-blue\'>prev</span> montou a fundamentação perfeita."',
      // Mulher sorridente, cabelo escuro (Top Center do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho8.png"
    },
    {
      name: "Pedro Oliveira",
      role: "Trabalhador Rural",
      rating: 4,
      text: '"Sempre achei que o processo rural era impossível de fazer pela internet. A <span class=\'text-logo-green\'>Agil</span><span class=\'text-logo-blue\'>prev</span> organizou tudo e meu benefício saiu sem eu sair de casa."',
      // Homem de meia-idade, determinado (Middle Right do grid - SUBSTITUÍDO CONFORME SOLICITAÇÃO)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho1.png"
    },
    {
      name: "Ana Costa",
      role: "Pensionista",
      rating: 5,
      text: '"Tirei todas as dúvidas pelo chat de forma simples. O documento saiu na hora e o processo foi super tranquilo. Recomendo muito!"',
      // Mulher loira, sorriso suave (Middle Left do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho3.png"
    },
    {
      name: "Dona Helena",
      role: "BPC / LOAS",
      rating: 5,
      text: '"Minha situação era muito difícil. Com a ajuda da <span class=\'text-logo-green\'>Agil</span><span class=\'text-logo-blue\'>prev</span>, consegui organizar meus documentos e ter o BPC aprovado em poucos meses."',
      // Mulher mais velha, olhar sereno (Middle Center do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/Testemunho4.png"
    },
    {
      name: "Seu Manoel",
      role: "Auxílio-Doença",
      rating: 4,
      text: '"Eu não conseguia mais trabalhar e o INSS negava tudo. O requerimento feito pela IA foi fundamental para provar minha incapacidade na perícia."',
      // Homem mais velho, experiente (Top Right do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho5.png"
    },
    {
      name: "João Santos",
      role: "Beneficiário",
      rating: 5,
      text: '"Meu auxílio-doença foi negado 3 vezes seguidas. Com os documentos gerados pela IA, entendi o erro e foi aprovado de primeira."',
      // Homem jovem, barba, sorrindo (Bottom Left do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho%206.png"
    },
    {
      name: "Julia Ferreira",
      role: "Auxílio-Maternidade",
      rating: 5,
      text: '"Consegui resolver tudo pelo celular. A facilidade de conversar pelo chat e já ter o papel pronto me poupou muito tempo."',
      // Mulher jovem, sorridente (Bottom Center do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho%207.png"
    },
    {
      name: "Maria Silva",
      role: "Aposentada",
      rating: 5,
      text: '"Depois de 2 anos tentando sozinho, o chat da <span class=\'text-logo-green\'>Agil</span><span class=\'text-logo-blue\'>prev</span> montou meu processo e em 45 dias minha aposentadoria foi concedida. Fantástico!"',
      // Mulher com óculos, cabelo cacheado (Bottom Right do grid)
      image: "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/testemunho9.png"
    }
  ];

  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  return (
    <section className="py-24 bg-agil-blue relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-agil-yellow/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            O que nossos <span className="text-agil-yellow">clientes</span> dizem?
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-semibold leading-relaxed">
            Histórias reais de pessoas que tiveram sucesso com a Agilprev
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Viewport */}
          <div className="overflow-hidden py-10">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / getVisibleCount())}%)` 
              }}
            >
              {[...testimonials, ...testimonials].map((item, idx) => (
                <div 
                  key={idx} 
                  className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-4"
                >
                  <div className="bg-white rounded-[12px] p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/50 flex flex-col items-center text-center h-full hover:shadow-[0_50px_100px_-25px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group">
                    {/* Internal Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/40 pointer-events-none rounded-[12px]"></div>

                    {/* Tight Face Portrait Close-up */}
                    <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full p-2 bg-gradient-to-br from-agil-blue/20 to-agil-green/20 mb-8 transition-transform duration-500 shadow-2xl group-hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="relative z-10 flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <LucideStar 
                          key={i} 
                          size={20} 
                          fill={i < item.rating ? "#FACC15" : "transparent"} 
                          className={`${i < item.rating ? 'text-agil-yellow' : 'text-gray-200'} drop-shadow-sm`} 
                        />
                      ))}
                    </div>

                    {/* Text content */}
                    <blockquote className="relative z-10 text-base md:text-lg text-gray-700 italic leading-relaxed mb-8 px-2 font-medium flex-grow"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                    />

                    {/* Identity footer */}
                    <div className="relative z-10 mt-auto">
                      <h4 className="text-xl font-black text-gray-900 mb-1">{item.name}</h4>
                      <span className="text-[10px] text-agil-blue font-black uppercase tracking-[0.25em] opacity-50">{item.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button 
            onClick={prev}
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all active:scale-90 z-30 border border-white/20 backdrop-blur-md shadow-lg"
            aria-label="Anterior"
          >
            <LucideChevronLeft size={24} className="md:w-8 md:h-8" />
          </button>
          
          <button 
            onClick={next}
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all active:scale-90 z-30 border border-white/20 backdrop-blur-md shadow-lg"
            aria-label="Próximo"
          >
            <LucideChevronRight size={24} className="md:w-8 md:h-8" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 transition-all duration-500 rounded-full ${
                  idx === currentIndex % testimonials.length ? 'w-10 bg-agil-yellow' : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ir para depoimento ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
