import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface MiniChatProps {
  onStartChat: (type: 'hero' | 'documento' | 'premium') => void;
}

const MiniChat: React.FC<MiniChatProps> = ({ onStartChat }) => {
  const [texto, setTexto] = useState('');

  const irParaChat = () => {
    if (texto.trim()) {
      localStorage.setItem('agil_initial_context', texto.trim());
    } else {
      localStorage.removeItem('agil_initial_context');
    }

    onStartChat('hero');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      irParaChat();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="bg-white rounded-3xl overflow-hidden flex flex-col"
        style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.22)', maxHeight: 'min(70dvh, 520px)' }}
      >
        <div className="px-5 pt-5 pb-3 overflow-y-auto flex-1 min-h-0">
          <p className="text-[15px] font-black text-slate-800 mb-1 leading-snug">
            Me conta o que está acontecendo
          </p>
         

          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: meu pedido de aposentadoria está parado há 6 meses e o INSS não responde..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13.5px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-agil-blue focus:bg-white transition-all resize-none mb-4"
          />

          <div className="space-y-2">
            <button
              onClick={irParaChat}
              className="w-full bg-agil-blue text-white font-black py-3.5 rounded-2xl text-[14px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
              style={{ boxShadow: '0 8px 20px -4px rgba(37,99,235,0.4)' }}
            >
              Iniciar atendimento
              <ArrowRight size={16} />
            </button>

            
          </div>
        </div>

        <div className="px-5 pb-4 text-center">
          <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
            Diagnóstico gratuito • Sem dados pessoais
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniChat;
