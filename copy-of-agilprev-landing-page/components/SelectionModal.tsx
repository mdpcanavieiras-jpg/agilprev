import React from 'react';
import { X, ArrowRight, Star, ShieldCheck, Check } from 'lucide-react';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'documento' | 'premium') => void;
}

const BASICO_ITEMS = [
  'Documento formal pronto para protocolo',
  'Fundamentação jurídica completa',
  'Guia prático de onde e como enviar',
];

const PREMIUM_ITEMS = [
  'Tudo do Documento Básico, mais:',
  'Análise Inteligente do seu caso',
  'Classificação de risco e orientação',
  'Checklist e próximos passos',
];

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className="modal-card relative z-10 mx-auto flex w-full max-w-[360px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:max-w-md max-h-[90vh]"
      >
        {/* Scroll container */}
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
            <div>
              <p className="font-black text-slate-900 text-[17px] sm:text-lg leading-tight">
                Como posso te ajudar?
              </p>
              <p className="text-[12px] sm:text-[13px] text-slate-400 font-medium mt-1">
                Escolha o nível de atendimento que você precisa.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="shrink-0 rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-4 px-5 pb-4 sm:space-y-3 sm:px-8">

            {/* ── Card Básico ── */}
            <div
              className="rounded-2xl border-2 border-slate-100 p-5 cursor-pointer transition-all active:scale-[0.99]"
              style={{ background: '#f8fafc' }}
              onClick={() => onSelect('documento')}
            >
              <div className="flex items-start gap-3 mb-3">
                <div>
                  <p className="font-black text-slate-900 text-[15px] leading-tight">
                    Documento Previdenciário
                  </p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                    Para quem já sabe o que precisa.
                  </p>
                </div>
                
              </div>

              <ul className="space-y-2 mb-4">
                {BASICO_ITEMS.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: '#2563eb' }}
                    >
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                className="w-full text-white font-black py-3 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#2563eb', boxShadow: '0 4px 16px -2px rgba(37,99,235,0.35)' }}
              >
                Gerar meu Documento <ArrowRight size={15} />
              </button>
            </div>

            {/* ── Card Premium ── */}
            <div
              className="relative cursor-pointer rounded-2xl border-2 p-5 transition-all active:scale-[0.99]"
              style={{
                borderColor: '#22c55e',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 55%)',
                boxShadow: '0 8px 30px -8px rgba(34,197,94,0.25)',
              }}
              onClick={() => onSelect('premium')}
            >
              {/* Badge */}
              <span
                className="absolute -top-3.5 left-5 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"
                style={{ background: '#22c55e', boxShadow: '0 2px 8px rgba(34,197,94,0.4)' }}
              >
                <Star size={9} fill="currentColor" /> Mais completo
              </span>

              <div className="flex items-start gap-3 mb-3 pt-1">
                <div>
                  <p className="font-black text-slate-900 text-[15px] leading-tight">
                    Documento + Análise Inteligente
                  </p>
                  <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                    Para quem quer segurança antes de protocolar.
                  </p>
                </div>
                
              </div>

              <ul className="space-y-2 mb-4">
                {PREMIUM_ITEMS.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13px] font-medium"
                    style={{ color: i === 0 ? '#64748b' : '#334155' }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: i === 0 ? '#94a3b8' : '#22c55e' }}
                    >
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                className="w-full text-white font-black py-3 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#22c55e', boxShadow: '0 4px 16px -2px rgba(34,197,94,0.4)' }}
              >
                Documento + Análise <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex flex-col items-center gap-3 border-t border-slate-100/80 px-6 py-6 sm:px-8">
            {/* Social proof */}
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/50?u=agil${i}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[11.5px] text-slate-500 font-semibold">
                <strong className="text-slate-700">+386 atendimentos</strong> nos últimos 7 dias
              </p>
            </div>

            {/* Segurança */}
            <div className="flex items-center gap-1.5 pb-[env(safe-area-inset-bottom,0px)]">
              <ShieldCheck size={12} className="text-slate-400" />
              <p className="text-[11px] text-slate-400 font-semibold">
                PIX seguro · Sem mensalidade · Acesso imediato
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
