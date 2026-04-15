import React from 'react';

const VideoExplanation: React.FC = () => {
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-tight">
            Veja como a <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span> funciona na prática
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Entenda em menos de 2 minutos como nossa tecnologia simplifica sua jornada para garantir seus direitos no INSS.
          </p>
        </div>
        
        {/* Container do Player de Vídeo */}
        <div className="relative group max-w-4xl mx-auto">
          {/* Brilho decorativo de fundo para profundidade */}
          <div className="absolute -inset-10 bg-blue-600/5 rounded-[4rem] blur-3xl group-hover:bg-blue-600/10 transition-all duration-1000 opacity-60 pointer-events-none"></div>
          
          {/* Moldura Principal do Vídeo - Arredondamento ajustado para 12px conforme solicitado */}
          <div className="relative bg-[#000000] rounded-[12px] overflow-hidden shadow-[0_64px_128px_-32px_rgba(15,23,42,0.3)] border border-gray-100/50 aspect-video">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/pxN7MsyvZaQ?rel=0&modestbranding=1&autoplay=0" 
              title="Agilprev - Tutorial e Tecnologia"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Badges de Status - Alinhamento e estilo profissional */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-16 gap-y-6 items-center">
             <div className="flex items-center gap-3.5 group/item">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300 group-hover/item:scale-125"></div>
                <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#64748B] group-hover/item:text-agil-blue transition-colors">Tutorial Completo</span>
             </div>
             <div className="flex items-center gap-3.5 group/item">
                <div className="w-2.5 h-2.5 rounded-full bg-agil-blue shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300 group-hover/item:scale-125"></div>
                <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#64748B] group-hover/item:text-agil-blue transition-colors">Tecnologia Certificada</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoExplanation;