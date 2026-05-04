import React from 'react';
import { Check } from 'lucide-react';
import MiniChat from './MiniChat';



interface HeroProps {
  onOpenModal: () => void;
  onStartChat: (type: 'hero' | 'documento' | 'premium') => void;
}

const AgilCheck = () => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/40 shrink-0">
    <div className="w-4 h-4 rounded-full bg-agil-yellow flex items-center justify-center">
      <Check size={10} strokeWidth={5} className="text-agil-blue" />
    </div>
  </div>
);

const Hero: React.FC<HeroProps> = ({ onOpenModal: _onOpenModal, onStartChat }) => {
  return (
    <section className="bg-agil-blue pt-16 pb-24 relative overflow-hidden px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Coluna esquerda: copy ── */}
          <div className="text-center lg:text-left mx-auto max-w-xl">
          <h1 className="text-[2.4rem] sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight max-w-[22ch] mx-auto lg:mx-0">
              A <span className="text-agil-yellow">Inteligência Artificial</span> que ajuda a resolver seu problema com o INSS!
            </h1>

            <p className="text-blue-100 text-lg md:text-xl lg:text-2xl font-medium mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              É rápido, prático e em minutos emitimos uma saída para o seu caso.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-3">
              {['Sem taxa de sucesso', 'Resultado em minutos', 'Atendimento 100% online'].map(item => (
                <div key={item} className="flex items-center gap-3 justify-center lg:justify-start">
                  <AgilCheck />
                  <span className="text-white font-bold text-sm uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Coluna direita: mini-chat ── */}
          <div>
            {/* Label acima do chat */}
            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
              <div className="flex-1 h-px bg-white/20 max-w-[60px]" />
              <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] text-center leading-snug max-w-[26ch]">
                Ou tire sua dúvida agora, de graça
              </p>
              <div className="flex-1 h-px bg-white/20 max-w-[60px]" />
            </div>

            <MiniChat onStartChat={onStartChat} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
