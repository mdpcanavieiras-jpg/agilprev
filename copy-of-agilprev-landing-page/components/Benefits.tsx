
import React from 'react';
import { DollarSign, Clock, FileText, Shield, MessageCircle, Zap } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    { icon: <DollarSign />, title: "Preço Fixo Transparente", desc: "Sem taxas ocultas ou percentuais sobre o benefício." },
    { icon: <Clock />, title: "Resultado Rápido", desc: "Nossa IA agiliza a análise e criação dos seus documentos para um processo mais veloz." },
    { icon: <FileText />, title: "Documentos Profissionais", desc: "Petições e recursos elaborados por especialistas e otimizados por IA." },
    { icon: <Shield />, title: "Segurança Jurídica", desc: "Todo o processo é supervisionado por advogados especializados." },
    { icon: <MessageCircle />, title: "Atendimento via Chat", desc: "Nosso chat com IA está disponível para tirar suas dúvidas a qualquer momento." },
    { icon: <Zap />, title: "Sem Burocracia", desc: "Processo simples e descomplicado do início ao fim." },
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-16 max-w-3xl mx-auto reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-tight">
            Por que escolher a <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span>?
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Combinamos a precisão da IA com a experiência de especialistas em direito previdenciário para garantir o melhor resultado.
          </p>
        </div>

        {/* Grade de Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-10 rounded-[2.5rem] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-start reveal delay-${(idx % 3) * 150} relative group overflow-hidden`}
            >
              {/* Toque de cor no hover */}
              <div className="absolute top-0 left-0 w-1 h-full bg-agil-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Icon Container */}
              <div className="w-16 h-16 bg-blue-50 text-agil-blue rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                {React.cloneElement(benefit.icon as React.ReactElement<{ size: number }>, { size: 32 })}
              </div>
              
              {/* Text Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                {benefit.title}
              </h3>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
