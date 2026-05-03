
import React from 'react';
import { Check, ShieldCheck, Zap, Star } from 'lucide-react';

interface PricingSelectionProps {
  onSelect: (type: 'documento' | 'premium') => void;
}

const PricingSelection: React.FC<PricingSelectionProps> = ({ onSelect }) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Elementos decorativos de fundo suaves para o fundo branco */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-agil-blue/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-agil-green/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Diretriz: dois produtos completos, diferença é profundidade */}
        <div className="text-center mb-20 max-w-3xl mx-auto reveal">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-tight">
            Dois produtos completos
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            A diferença não está na qualidade, mas no nível de profundidade e estratégia. Escolha o que faz sentido para o seu caso.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          
          {/* Plan 1: Documento Básico */}
          <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border-2 border-agil-blue p-8 md:p-10 shadow-[0_45px_90px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_60px_120px_-25px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 group reveal">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-agil-blue transition-colors">Documento Básico</h3>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-snug">Execução operacional. Documento padrão para protocolo no INSS ou CRPS. Não realiza avaliação do caso.</p>
            </div>
            
            <div className="pt-6 border-t border-slate-50 mb-8">
              
            </div>

            <div className="flex-grow flex flex-col justify-start">
              <ul className="space-y-5 mb-10">
                {[
                  "Documento previdenciário protocolável",
                  "Chat com IA para coleta de dados",
                  "Guia de protocolo passo a passo",
                  "Anexo com orientações oficiais"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-agil-blue/10 rounded-full p-1 shrink-0 mt-0.5">
                      <Check className="text-agil-blue" size={16} strokeWidth={3} />
                    </div>
                    <span className="text-base font-medium text-slate-600 leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <button 
                onClick={() => onSelect('documento')}
                className="w-full bg-agil-blue text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-blue-600 transition-all transform active:scale-95 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] mb-6 flex items-center justify-center gap-2 animate-pulse-button"
              >
                <span>Gerar documento</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <ShieldCheck size={14} />
                Segurança Certificada
              </div>
            </div>
          </div>

          {/* Plan 2: Documento + Análise Inteligente Personalizada */}
          <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border-2 border-agil-green p-8 md:p-10 shadow-[0_50px_100px_-20px_rgba(15,70,30,0.15)] hover:shadow-[0_70px_140px_-30px_rgba(15,70,30,0.2)] relative z-10 hover:-translate-y-2 transition-all duration-500 group reveal delay-200">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-agil-green text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 flex items-center gap-2 text-center max-w-[90%]">
              <Star size={12} fill="currentColor" />
              Recomendado
            </div>

            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Documento + Análise Inteligente Personalizada</h3>
              <p className="text-base md:text-lg text-slate-600 font-semibold leading-snug">Indicado para quem busca mais segurança antes de protocolar.</p>
            </div>
            
            <div className="pt-6 border-t border-agil-green/10 mb-8">
              
            </div>

            <div className="flex-grow flex flex-col justify-start">
              <ul className="space-y-5 mb-10">
                {[
                  "Documento ajustado ao seu caso",
                  "Conferência automática das informações",
                  "Identificação de possíveis riscos",
                  "Orientação clara sobre o próximo passo",
                  "Ideal para demora, indeferimento ou dúvidas"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-agil-green/10 rounded-full p-1 shrink-0 mt-0.5">
                      <Check className="text-agil-green" size={16} strokeWidth={4} />
                    </div>
                    <span className="text-base font-bold text-slate-800 leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <button 
                onClick={() => onSelect('premium')}
                className="w-full bg-agil-green text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-green-600 transition-all transform active:scale-95 shadow-[0_20px_50px_-10px_rgba(34,197,94,0.5)] mb-6 flex items-center justify-center gap-2 group/btn animate-pulse-button"
              >
                <span>Documento + Análise Inteligente</span>
                <Zap size={18} fill="currentColor" className="animate-pulse" />
              </button>
              <p className="text-center text-[9px] font-black text-agil-green/50 uppercase tracking-[0.2em]">
                Sem taxas de sucesso ou surpresas
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PricingSelection;
