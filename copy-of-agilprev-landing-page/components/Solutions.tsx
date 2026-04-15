
import React from 'react';
import { Landmark, HeartPulse, UserCircle, Briefcase } from 'lucide-react';

const Solutions: React.FC = () => {
  const solutions = [
    {
      icon: <Landmark />,
      title: "Aposentadorias",
      desc: "Análise completa para aposentadoria por idade, tempo de contribuição, especial e por invalidez.",
      color: "bg-green-100/50 text-agil-green"
    },
    {
      icon: <HeartPulse />,
      title: "Auxílio-Doença",
      desc: "Preparamos seu pedido ou recurso em caso de negativa para garantir seu direito ao auxílio.",
      color: "bg-green-100/50 text-agil-green"
    },
    {
      icon: <UserCircle />,
      title: "BPC (LOAS)",
      desc: "Assessoria para a concessão do BPC/LOAS para idosos e pessoas com deficiência.",
      color: "bg-green-100/50 text-agil-green"
    },
    {
      icon: <Briefcase />,
      title: "Outros Benefícios",
      desc: "Auxílio-reclusão, pensão por morte, salário-maternidade e revisões de benefícios.",
      color: "bg-green-100/50 text-agil-green"
    }
  ];

  return (
    <section className="py-24 bg-agil-blue relative overflow-hidden">
      {/* Elementos decorativos de fundo para profundidade extra na seção */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-agil-yellow/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Nossas <span className="text-agil-yellow">soluções</span> para você
          </h2>
          <p className="text-blue-50 text-lg md:text-xl font-medium leading-relaxed opacity-90">
            Cuidamos de diversos tipos de benefícios do INSS com agilidade e expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-[2.5rem] p-10 border border-white/20 shadow-[0_45px_90px_-25px_rgba(0,0,0,0.35)] hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.45)] hover:-translate-y-2 transition-all duration-500 reveal delay-${(idx + 1) * 100} relative group flex flex-col h-full overflow-hidden`}
            >
              {/* Volume Material: Gradiente radial sutil para evitar visual chapado */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/70 rounded-[2.5rem] pointer-events-none"></div>

              <div className="relative z-10">
                {/* Ícone com sombra interna própria */}
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-[0_8px_20px_-4px_rgba(34,197,94,0.25)] group-hover:scale-110 transition-transform duration-500`}>
                  {React.cloneElement(item.icon as React.ReactElement<{ size: number }>, { size: 32 })}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-5 tracking-tight leading-tight group-hover:text-agil-blue transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              
              {/* Borda de Definição (Bevel sutil) */}
              <div className="absolute inset-0 rounded-[2.5rem] border-t border-l border-white/80 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-[2.5rem] border border-black/[0.05] pointer-events-none group-hover:border-agil-blue/20 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
