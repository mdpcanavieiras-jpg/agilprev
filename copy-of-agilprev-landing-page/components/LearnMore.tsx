import React from 'react';
import { Play, ArrowUpRight } from 'lucide-react';

const LearnMore: React.FC = () => {
  const LOGO_URL = "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/Design_sem_nome__9_-removebg-preview.png";

  const videos = [
    {
      title: "Qual documento o Agilprev gera?",
      id: "N0ILSt6ppmo",
      url: "https://www.youtube.com/watch?v=N0ILSt6ppmo",
      thumbnail: "https://img.youtube.com/vi/N0ILSt6ppmo/maxresdefault.jpg"
    },
    {
      title: "Sem burocracia, sem complicação.",
      id: "MHjgIyNbmts",
      url: "https://www.youtube.com/watch?v=MHjgIyNbmts",
      thumbnail: "https://img.youtube.com/vi/MHjgIyNbmts/maxresdefault.jpg"
    },
    {
      title: "A favor do respeito e da justiça",
      id: "JSTmNw0Sk7M",
      url: "https://www.youtube.com/watch?v=JSTmNw0Sk7M",
      thumbnail: "https://img.youtube.com/vi/JSTmNw0Sk7M/maxresdefault.jpg"
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-tight">
            <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span> no You Tube!
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Explore nossos conteúdos e entenda como estamos transformando o acesso à previdência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {videos.map((video, idx) => (
            <a 
              key={idx} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-[12px] shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-7 hover:shadow-[0_45px_80px_-20px_rgba(37,99,235,0.2)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full relative"
            >
              <div className="min-h-[70px] flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-agil-blue transition-colors leading-tight pr-6">
                  {video.title}
                </h3>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-agil-blue/10 group-hover:text-agil-blue transition-all">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              
              {/* Container do Vídeo com arredondamento de 12px */}
              <div className="relative rounded-[12px] overflow-hidden aspect-video bg-gray-100 mt-auto shadow-inner">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                
                {/* Play Overlay with stronger contrast */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl transform group-hover:scale-125 transition-all duration-500">
                    <Play size={26} fill="currentColor" className="ml-1" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                   <img src={LOGO_URL} className="h-[60px] w-auto grayscale brightness-0" alt="Icon" />
                </div>
              </div>

              {/* Internal highlight bevel */}
              <div className="absolute inset-0 rounded-[12px] border-t border-l border-white/80 pointer-events-none"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnMore;