
import React from 'react';

const HowWeHelp: React.FC = () => {
  const LOGO_URL = "https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png";
  const CHARACTER_URL = "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Passaro%20agilprev/WhatsApp%20Image%202025-08-30%20at%2014.38.17.jpeg";

  return (
    <section className="py-24 bg-[#E0E7FF]/20 relative overflow-hidden">
      {/* Background Waves */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 150C400 50 800 250 1440 150V800H0V150Z" fill="url(#wave-gradient-help)" />
            <defs>
              <linearGradient id="wave-gradient-help" x1="720" y1="150" x2="720" y2="800" gradientUnits="userSpaceOnUse">
                <stop stopColor="#BFDBFE" stopOpacity="0.4" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">
            Identificamos o problema e atuamos na solução.
          </h2>
          <p className="text-black/70 text-xl font-medium">
            Conte o que está acontecendo com o INSS
          </p>
        </div>

        <div className="relative flex flex-col items-center">
          
          {/* Central Diagram Area */}
          <div className="relative w-full max-w-5xl flex flex-col items-center mb-8">
            
            {/* Character */}
            <div className="relative mb-6 reveal z-20">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-[#f4f4f4] rounded-full flex items-center justify-center border-8 border-[#f4f4f4] shadow-2xl animate-float overflow-hidden">
                <img 
                  src={CHARACTER_URL} 
                  alt="Agilprev Specialist" 
                  className="w-full h-full object-contain p-6"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Laptop Badge */}
              <div className="absolute bottom-2 right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 z-30">
                <div className="w-8 h-6 bg-slate-800 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-agil-green rounded-sm flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrows & Brand Text Container */}
            <div className="relative w-full flex justify-center items-center h-32 md:h-40 mb-4">
              {/* Left Arrow (Curving from character to left card) */}
              <div className="absolute left-[5%] md:left-[12%] top-[-60px] w-[30%] h-64 hidden md:block pointer-events-none">
                <svg viewBox="0 0 300 200" fill="none" className="w-full h-full text-[#1E3A8A]/20">
                  <path d="M280 40 Q150 0 40 180" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" />
                  <path d="M40 180 L55 175 M40 180 L45 165" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>

              {/* Brand Text */}
              <div className="text-center reveal delay-100 z-10 px-4">
                <p className="text-black font-bold text-2xl md:text-3xl max-w-lg mx-auto leading-tight">
                  O <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span> identifica sua situação<br />
                  e prepara o caminho correto
                </p>
              </div>

              {/* Right Arrow (Curving from character to right card) */}
              <div className="absolute right-[5%] md:right-[12%] top-[-60px] w-[30%] h-64 hidden md:block pointer-events-none">
                <svg viewBox="0 0 300 200" fill="none" className="w-full h-full text-[#1E3A8A]/20">
                  <path d="M20 40 Q150 0 260 180" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" />
                  <path d="M260 180 L245 175 M260 180 L255 165" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl reveal delay-200">
              
              {/* Card 1: Documento Previdenciário */}
              <div className="relative group">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 transition-transform hover:-translate-y-2 duration-500 h-full flex flex-col">
                  <div className="bg-gradient-to-r from-[#65A30D] to-[#84CC16] py-4 px-8 text-center">
                    <h3 className="text-white font-black text-xl tracking-tight">Documento Previdenciário</h3>
                  </div>
                  <div className="p-5 sm:p-8 flex items-start gap-4 sm:gap-6 flex-grow">
                    <div className="relative shrink-0">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 bg-slate-50 rounded-lg border-2 border-slate-200 flex flex-col p-2 gap-1">
                        <div className="w-full h-1 bg-slate-200 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 rounded"></div>
                        <div className="w-2/3 h-1 bg-slate-200 rounded"></div>
                        <div className="mt-auto flex justify-center">
                          <div className="w-10 h-10 rounded-full border-4 border-[#1E3A8A] flex items-center justify-center">
                             <div className="w-1 h-4 bg-[#1E3A8A] rotate-45 translate-x-3 translate-y-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="text-slate-700 font-semibold leading-relaxed text-base sm:text-lg">
                        Pedido formal correto para destravar, concluir ou dar andamento ao seu caso no INSS.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Speech Bubble Tail pointing UP */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-l border-t border-slate-100 rotate-45 z-0 shadow-[-5px_-5px_10px_rgba(0,0,0,0.02)]"></div>
              </div>

              {/* Card 2: Documento + Análise Inteligente */}
              <div className="relative group">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 transition-transform hover:-translate-y-2 duration-500 h-full flex flex-col">
                  <div className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] py-4 px-8 text-center">
                    <h3 className="text-white font-black text-xl tracking-tight">Documento + Análise Inteligente</h3>
                  </div>
                  <div className="p-5 sm:p-8 flex items-start gap-4 sm:gap-6 flex-grow">
                    <div className="relative shrink-0">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 bg-slate-50 rounded-lg border-2 border-slate-200 flex flex-col p-2 gap-1">
                        <div className="w-full h-1 bg-slate-200 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 rounded"></div>
                        <div className="w-2/3 h-1 bg-slate-200 rounded"></div>
                        <div className="mt-auto flex justify-end">
                          <div className="w-8 h-8 bg-agil-green rounded-lg flex items-center justify-center shadow-lg">
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-1 space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#1E40AF] rotate-45 mt-2 shrink-0"></div>
                        <p className="text-slate-700 font-bold text-base sm:text-lg">Documento completo</p>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#1E40AF] rotate-45 mt-2 shrink-0"></div>
                        <p className="text-slate-700 font-semibold leading-relaxed text-base sm:text-lg">
                          + explicação clara do seu caso, riscos e próximos passos, para resolver com mais segurança e confiança.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Speech Bubble Tail pointing UP */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-l border-t border-slate-100 rotate-45 z-0 shadow-[-5px_-5px_10px_rgba(0,0,0,0.02)]"></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeHelp;
