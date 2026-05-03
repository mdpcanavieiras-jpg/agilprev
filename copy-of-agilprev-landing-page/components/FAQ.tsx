import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

// Fixed line 13: Added FAQItemProps generic to React.FC to define expected props
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <div className={`mb-6 border border-gray-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 bg-white ${isOpen ? 'shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] ring-1 ring-agil-blue/5' : 'shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1'}`}>
      <button
        onClick={onClick}
        className="w-full px-5 sm:px-8 py-5 sm:py-7 flex items-center justify-between text-left focus:outline-none group"
      >
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <span className="text-agil-blue font-black text-sm opacity-20">{String(index + 1).padStart(2, '0')}</span>
          <span
          className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 min-w-0 ${isOpen ? 'text-agil-blue' : 'text-gray-900 group-hover:text-agil-blue'}`}
          dangerouslySetInnerHTML={{ __html: question }}
          />
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-agil-blue text-white rotate-180 shadow-lg shadow-blue-500/20' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-agil-blue'}`}>
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </button>
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div
        className="px-5 sm:px-10 pb-8 sm:pb-10 pt-2 text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed font-medium ml-0 sm:ml-10 border-t border-gray-50/50"
        dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "O <span class=\"text-logo-green\">Agil</span><span class=\"text-logo-blue\">prev</span> substitui um advogado?",
      answer: "Não. O <span class=\"text-logo-green\">Agil</span><span class=\"text-logo-blue\">prev</span> é uma ferramenta de tecnologia que gera documentos técnicos baseados em inteligência artificial para processos administrativos no INSS. Para causas judiciais complexas ou quando o segurado deseja representação direta, recomendamos sempre a consulta com um advogado especializado."
    },
    {
      question: "Como recebo meus documentos?",
      answer: "É instantâneo! Após concluir a conversa com nossa IA e confirmar o pagamento, seus documentos são gerados automaticamente. Você poderá baixá-los diretamente na tela e também receberá uma cópia segura no seu e-mail cadastrado."
    },
    {
      question: "Os documentos são aceitos pelo INSS?",
      answer: "Sim. Nossos documentos seguem rigorosamente os padrões técnicos exigidos pelo INSS (Decreto 3.048/99). A fundamentação é feita de forma profissional e clara, facilitando a análise do perito ou servidor responsável pelo seu caso."
    },
    {
      question: "Qual plano devo escolher?",
      answer: "O plano 'Documento' é ideal para pedidos diretos. O plano 'Premium' é altamente recomendado se o seu caso já teve uma negativa ou se você tem dúvidas sobre os riscos. Ele inclui uma análise estratégica da nossa IA que aponta pontos críticos e o próximo passo mais seguro."
    },
    {
      question: "Preciso pagar se eu não ganhar o benefício?",
      answer: "O valor pago é referente à prestação de serviço tecnológico de geração do documento e análise estratégica. Diferente de advogados que cobram porcentagens sobre o atrasado (taxa de sucesso), nós cobramos um valor fixo acessível apenas pela tecnologia fornecida."
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-agil-green text-[12px] font-bold mb-6 uppercase tracking-wider border border-green-100/50">
            <HelpCircle size={16} fill="currentColor" />
            Dúvidas Frequentes
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Tire suas dúvidas sobre como a <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span> pode ajudar no seu caso com o INSS.
          </p>
        </div>

        <div className="reveal delay-200">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              index={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;