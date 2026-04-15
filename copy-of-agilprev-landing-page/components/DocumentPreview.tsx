
import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Check, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const AgilCheckYellow = () => (
  <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/40 shrink-0">
    <div className="w-5 h-5 rounded-full bg-agil-yellow flex items-center justify-center">
      <Check size={12} strokeWidth={5} className="text-agil-blue" />
    </div>
  </div>
);

const DocumentPreview: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const LOGO_URL = "https://xfznmbkzgysdgqiboghr.supabase.co/storage/v1/object/public/Imagem%20logo%20Agilprev/Design_sem_nome__9_-removebg-preview.png";

  const totalPages = 5;

  const next = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    if (isPaused || selectedPage !== null) return;
    const interval = setInterval(next, 7000);
    return () => clearInterval(interval);
  }, [next, isPaused, selectedPage]);

  const renderContent = (index: number, isModal: boolean = false) => {
    const textBase = isModal ? "text-[10px] sm:text-[12px] md:text-[14px]" : "text-[6px] sm:text-[8px] md:text-[9.5px]";
    const titleBase = isModal ? "text-[12px] sm:text-[14px] md:text-[18px]" : "text-[7px] sm:text-[9px] md:text-[11px]";
    const spacing = isModal ? "space-y-4" : "space-y-2";
    
    const watermark = (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] rotate-[-30deg]">
        <img src={LOGO_URL} alt="Watermark" className={isModal ? "w-[60%]" : "w-[80%]"} />
      </div>
    );

    switch (index) {
      case 0: // Página 1: Identificação e Fatos
        return (
          <>
            {watermark}
            <div className={`font-bold uppercase opacity-50 ${isModal ? 'mb-4' : 'mb-2'}`}>DOCUMENTO PREVIDENCIÁRIO – USO ADMINISTRATIVO</div>
            <div className={isModal ? 'mb-4' : 'mb-2'}>Prado/BA, 02 de fevereiro de 2026</div>
            <div className={`font-black text-agil-blue uppercase leading-tight ${titleBase} ${isModal ? 'mb-6' : 'mb-4'}`}>
              REQUERIMENTO ADMINISTRATIVO DE CONCLUSÃO DE ANÁLISE DE BENEFÍCIO PREVIDENCIÁRIO
            </div>
            <div className={`font-bold mb-4 ${isModal ? 'text-lg' : ''}`}>
              AO INSTITUTO NACIONAL DO SEGURO SOCIAL – INSS<br/>
              <span className="font-medium">À Agência da Previdência Social competente</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
              <div className="font-bold uppercase mb-1 opacity-70">IDENTIFICAÇÃO DO SEGURADO</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-bold">Nome completo:</span> Daniel Felix Carvalho</p>
                <p><span className="font-bold">CPF:</span> 074.677.395-44</p>
                <p><span className="font-bold">RG:</span> 5.750.048.494</p>
                <p><span className="font-bold">Protocolo / NB / NIT:</span> 85845995</p>
                <p className="col-span-full"><span className="font-bold">Endereço completo:</span> Rua Valdeck Ornelas, 16, Centro, Prado/BA, 45.980-000</p>
                <p className="col-span-full"><span className="font-bold">Tipo de benefício requerido:</span> Aposentadoria por tempo de contribuição</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-bold mb-1 uppercase">DOS FATOS</div>
              <p className="text-justify leading-relaxed">
                O segurado protocolou requerimento administrativo de concessão de benefício previdenciário junto ao INSS, conforme número de protocolo acima informado. O referido pedido permanece em <span className="font-bold">análise administrativa há período superior a quatro meses</span>, sem conclusão, sem decisão formal, indeferimento ou comunicação eficaz acerca da existência de eventual exigência pendente.
              </p>
              <p className="text-justify leading-relaxed">
                Apesar de consultas regulares ao sistema Meu INSS, o status do requerimento permanece inalterado, gerando <span className="font-bold">insegurança jurídica</span> e impacto direto na subsistência do segurado, especialmente diante da dependência de recursos para manutenção de sua saúde e aquisição de medicamentos essenciais.
              </p>
              <p className="text-justify leading-relaxed">
                Ressalte-se que o requerente sempre agiu de boa-fé, acompanhando o andamento do processo e mantendo-se integralmente à disposição da Autarquia para eventual cumprimento de exigências.
              </p>
            </div>
          </>
        );
      case 1: // Página 2: Direito e Pedidos
        return (
          <>
            {watermark}
            <div className="font-bold mb-2 uppercase text-agil-blue border-b border-gray-100 pb-1">DO DIREITO</div>
            <p className="mb-3 text-justify leading-relaxed">
              A Constituição Federal assegura o direito de acesso à apreciação administrativa e à tutela de direitos (art. 5º, XXXV), bem como o direito à <span className="font-bold">duração razoável do processo</span> (art. 5º, LXXVIII), impondo à Administração Pública o dever de eficiência (art. 37).
            </p>
            <p className="mb-3 text-justify leading-relaxed">
              No âmbito infraconstitucional, a Lei nº 9.784/1999, em seu art. 49, estabelece que a Administração Pública deve decidir os processos administrativos no prazo de <span className="font-bold">30 dias</span>, prorrogável por igual período mediante justificativa expressa.
            </p>
            <p className="mb-5 text-justify leading-relaxed">
              A manutenção do pedido em análise por prazo excessivo, sem decisão ou comunicação formal ao segurado, configura violação aos princípios da razoabilidade, da <span className="font-bold">eficiência administrativa</span> e da <span className="font-bold">segurança jurídica</span>.
            </p>
            <div className="font-bold mb-2 uppercase text-agil-blue border-b border-gray-100 pb-1">DOS PEDIDOS</div>
            <ul className="list-lower-alpha pl-6 space-y-1 mb-6">
              <li>A <span className="font-bold">conclusão da análise</span> do pedido administrativo de aposentadoria por tempo de contribuição;</li>
              <li>Caso exista exigência pendente, que esta seja <span className="font-bold">formalmente comunicada</span>, com indicação clara e objetiva dos documentos necessários;</li>
              <li>A comunicação da decisão administrativa de forma motivada, nos termos legais;</li>
              <li>A preservação integral dos direitos do segurado.</li>
            </ul>
            <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
              <div>
                <p className="font-medium">Nestes termos, pede deferimento.</p>
                <p className="opacity-60">Prado/BA, 02 de fevereiro de 2026</p>
              </div>
              <div className="text-right">
                <div className="w-32 h-px bg-slate-400 mb-1 ml-auto"></div>
                <p className="font-bold uppercase">Daniel Felix Carvalho</p>
                <p className="opacity-50 text-[0.8em]">CPF nº 074.677.395-44</p>
              </div>
            </div>
          </>
        );
      case 2: // Página 3: Análise Inteligente Parte 1
        return (
          <>
            {watermark}
            <div className={`flex flex-col mb-4 ${spacing}`}>
              <p className="font-bold uppercase text-agil-blue text-[0.8em]">PÁGINA EM ANEXO – INSTRUÇÕES PRÁTICAS</p>
              <p><span className="font-bold">Onde protocolar:</span> site ou aplicativo Meu INSS; telefone 135; ou presencialmente em uma Agência da Previdência Social.</p>
              <p><span className="font-bold">Prazos legais:</span> Lei nº 9.784/1999 – art. 49 (30 + 30 dias).</p>
            </div>
            <div className="bg-slate-900 text-white px-6 py-4 rounded-xl mb-4 text-center">
              <div className="font-black tracking-[0.2em] uppercase">ANÁLISE INTELIGENTE DO CASO</div>
              <div className="text-[0.7em] opacity-50 italic">(Exclusiva ao usuário – Agilprev Premium)</div>
            </div>
            <div className={spacing}>
              <section className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <h4 className="font-bold text-agil-blue mb-1 uppercase">1. Situação atual do seu pedido</h4>
                <p className="text-justify">Seu pedido de aposentadoria por tempo de contribuição está em análise há mais de quatro meses, sem qualquer resposta formal do INSS. O benefício <span className="font-bold">não foi negado</span>, mas está parado dentro do sistema administrativo.</p>
              </section>
              <section className="p-1">
                <h4 className="font-bold text-agil-blue mb-1 uppercase">2. Leitura técnica do que está acontecendo</h4>
                <p className="text-justify">Essa demora costuma ocorrer quando o processo fica retido em fila interna, sem prioridade, ou quando houve análise parcial sem finalização.</p>
              </section>
              <section className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <h4 className="font-bold text-orange-700 mb-1 uppercase">3. Classificação do nível de atenção do seu caso</h4>
                <p className="font-black text-orange-600">CLASSIFICAÇÃO: ATENÇÃO MODERADA</p>
                <ul className="text-[0.9em] opacity-80 list-disc pl-5">
                  <li>O prazo legal já foi superado;</li>
                  <li>Não há exigência nem indeferimento;</li>
                  <li>A demora já está impactando sua saúde e subsistência.</li>
                </ul>
              </section>
            </div>
          </>
        );
      case 3: // Página 4: Recomendações
        return (
          <>
            {watermark}
            <div className={`${isModal ? 'space-y-6' : 'space-y-3'}`}>
              <section>
                <h4 className="font-bold text-agil-blue mb-1 uppercase border-b border-gray-100 pb-1">4. Por que este documento foi o caminho mais seguro agora</h4>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Não prejudica seu pedido original;</li>
                  <li>Obriga o INSS a se manifestar oficialmente;</li>
                  <li>Pode gerar decisão ou exigência formal;</li>
                  <li>Cria prova administrativa da demora, protegendo seus direitos.</li>
                </ul>
              </section>
              
              <section className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="font-bold text-agil-blue mb-1.5 uppercase">5. O que normalmente acontece após o protocolo</h4>
                <div className="flex flex-col gap-1.5 text-[0.95em]">
                  <div className="flex items-center gap-2"><Check size={12} className="text-agil-green"/> Emitir exigência de documentos</div>
                  <div className="flex items-center gap-2"><Check size={12} className="text-agil-green"/> Concluir a análise e decidir</div>
                  <div className="flex items-center gap-2 text-slate-400"><X size={12}/> Permanecer inerte por novo período</div>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section>
                  <h4 className="font-bold text-agil-blue mb-1 uppercase border-b border-gray-50 pb-0.5">6. Pontos de atenção</h4>
                  <ul className="list-disc pl-5 space-y-0.5 opacity-80">
                    <li>Se surgir exigência, cumpra no prazo;</li>
                    <li>Não abra novo pedido igual;</li>
                    <li>Guarde o comprovante do protocolo.</li>
                  </ul>
                </section>
                <section>
                  <h4 className="font-bold text-red-600 mb-1 uppercase border-b border-gray-50 pb-0.5">7. O que não é recomendável</h4>
                  <ul className="list-disc pl-5 space-y-0.5 opacity-80">
                    <li>Entrar com recurso sem decisão;</li>
                    <li>Ajuizar ação judicial sem nova provocação.</li>
                  </ul>
                </section>
              </div>
            </div>
          </>
        );
      case 4: // Página 5: Checklist
        return (
          <>
            {watermark}
            <div className="flex flex-col h-full">
              <section className="bg-white p-6 rounded-2xl border-2 border-slate-50 shadow-sm mb-6">
                <h4 className="font-black text-agil-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-agil-blue rounded-full"></div>
                  8. Checklist Rápido
                </h4>
                <ul className="space-y-2 font-bold text-slate-600">
                  <li className="flex items-center gap-3"><div className="w-3 h-3 border border-slate-200 rounded shrink-0"></div> Documento com foto (RG/CNH)</li>
                  <li className="flex items-center gap-3"><div className="w-3 h-3 border border-slate-200 rounded shrink-0"></div> CPF e Comprovante de residência</li>
                  <li className="flex items-center gap-3"><div className="w-3 h-3 border border-slate-200 rounded shrink-0"></div> Número do protocolo original</li>
                  <li className="flex items-center gap-3"><div className="w-3 h-3 border border-slate-200 rounded shrink-0"></div> Comprovante do protocolo deste requerimento</li>
                </ul>
              </section>
              <div className="mt-auto border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-400 uppercase text-[0.7em] mb-1">Observação final importante</h4>
                <p className="text-justify italic text-gray-400 leading-tight">
                  Esta Análise Inteligente é automatizada, baseada exclusivamente nas informações fornecidas. <span className="font-bold">Não substitui advogado, não garante concessão de benefício e não constitui parecer jurídico formal.</span>
                </p>
              </div>
              <div className="flex justify-center mt-6 opacity-10">
                <img src={LOGO_URL} alt="Agilprev" className="h-6 grayscale" />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderPageWrapper = (index: number) => {
    return (
      <div 
        key={index}
        className="w-full shrink-0 px-2 cursor-pointer transition-transform hover:scale-[0.99]"
        onClick={() => setSelectedPage(index)}
      >
        <div className="w-full aspect-[1/0.9] bg-white p-5 sm:p-6 md:p-8 text-[6.5px] sm:text-[8.5px] md:text-[10px] text-gray-900 leading-[1.3] shadow-inner relative overflow-hidden flex flex-col font-sans group/card">
          {renderContent(index, false)}
          <div className="absolute inset-0 bg-agil-blue/0 group-hover/card:bg-agil-blue/5 transition-colors flex items-center justify-center">
            <Maximize2 className="text-agil-blue opacity-0 group-hover/card:opacity-100 transition-opacity" size={32} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-agil-blue relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 max-w-3xl mx-auto reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[12px] font-bold mb-6 border border-white/20 uppercase tracking-wider">
            <Bookmark size={16} fill="currentColor" />
            Documentos Reais
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Transparência <span className="text-agil-yellow">total</span>
          </h2>
          <p className="text-white/80 text-lg font-medium">Clique nas páginas para ampliar e ler o conteúdo completo.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          <div 
            className="w-full lg:w-[58%] relative reveal"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden group">
              <div 
                className="flex transition-transform duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {[0, 1, 2, 3, 4].map((idx) => renderPageWrapper(idx))}
              </div>

              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/10 text-slate-500 hover:bg-agil-blue hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"><ChevronLeft size={28} /></button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/10 text-slate-500 hover:bg-agil-blue hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"><ChevronRight size={28} /></button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button key={idx} onClick={() => setCurrentPage(idx)} className={`h-2 rounded-full transition-all duration-500 ${currentPage === idx ? 'w-10 bg-agil-blue' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>

              <div className="absolute top-6 right-6 px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded uppercase tracking-widest shadow-xl z-20">PDF REAL</div>
            </div>
            
            <p className="text-center text-white/50 text-[11px] font-bold uppercase tracking-[0.25em] mt-8">
              Página {currentPage + 1} de {totalPages} • Compacto Sem Cortes
            </p>
          </div>

          <div className="w-full lg:w-[42%] reveal delay-200">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight tracking-tight">Qualidade técnica superior em cada página</h3>
            <ul className="space-y-8">
              {[
                { t: "Argumentação de alto nível", d: "Petições fundamentadas na lei e jurisprudência atualizada." },
                { t: "Estrutura padrão INSS", d: "Documentos prontos para serem aceitos e analisados de imediato." },
                { t: "Fácil de protocolar", d: "Você recebe o PDF e as instruções de como anexar no Meu INSS." },
                { t: "Segurança Jurídica", d: "Lógica testada em milhares de casos reais com sucesso." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-5 group">
                  <AgilCheckYellow />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white tracking-tight leading-none mb-2 group-hover:text-agil-yellow transition-colors">{item.t}</span>
                    <span className="text-white/60 text-sm font-medium leading-relaxed">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Visualização Ampliada */}
      {selectedPage !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setSelectedPage(null)}></div>
          <div className="relative w-full max-w-4xl max-h-full bg-white rounded-[2rem] shadow-2xl overflow-y-auto animate-fade-in-up">
            <button 
              onClick={() => setSelectedPage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-agil-blue hover:text-white transition-all z-[310]"
            >
              <X size={24} />
            </button>
            <div className="p-8 sm:p-12 md:p-16 text-gray-900 font-sans min-h-[141%] relative flex flex-col">
              {renderContent(selectedPage, true)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DocumentPreview;
