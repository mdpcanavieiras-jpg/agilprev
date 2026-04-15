import React, { useState, useMemo } from 'react';
import { ArrowLeft, Lock, Unlock, Shield, Star, CheckCircle, FileText, Zap } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface PreviewDocumentPageProps {
  serviceType: 'documento' | 'premium';
  /** Documento completo já gerado */
  documentContent: string;
  sessionId: string;
  onBack: () => void;
  /** Chamado após pagamento confirmado — inicia o download do PDF */
  onPaymentConfirmed: () => void;
}

const LOGO = 'https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png';
const PRICES = { documento: 'R$ 29,00', premium: 'R$ 59,00' };

/** Extrai seções do documento gerado para exibição estruturada */
function parseDocument(content: string) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

  // Título: primeiras linhas em maiúsculo ou que contenham palavras-chave de título
  const titleLines: string[] = [];
  let i = 0;
  while (i < lines.length && (lines[i] === lines[i].toUpperCase() || titleLines.length < 3)) {
    if (lines[i].length > 3) titleLines.push(lines[i]);
    i++;
    if (titleLines.length >= 4) break;
  }

  // Identificação do segurado (bloco com Nome:, CPF:, etc.)
  const idBlock: string[] = [];
  for (const line of lines) {
    if (/^(nome|cpf|rg|endereço|nit|pis|protocolo|tipo|benefício)/i.test(line)) {
      idBlock.push(line);
    }
    if (idBlock.length >= 6) break;
  }

  // Início de DOS FATOS
  const fatosIdx = lines.findIndex(l => /dos fatos|i\s*[–—-]\s*dos fatos/i.test(l));
  const fatosLines: string[] = [];
  if (fatosIdx !== -1) {
    for (let j = fatosIdx + 1; j < lines.length && fatosLines.length < 6; j++) {
      if (/do direito|ii\s*[–—-]/i.test(lines[j])) break;
      if (lines[j].length > 10) fatosLines.push(lines[j]);
    }
  }

  // Seções bloqueadas (títulos)
  const lockedSections: string[] = [];
  const sectionPatterns = [
    /^(ii|do direito|\d+\s*[–—-]\s*do direito)/i,
    /^(iii|do pedido|\d+\s*[–—-]\s*do pedido)/i,
    /^(iv|documentos|anexo|instrução|página em anexo)/i,
    /^(análise inteligente|1\.\s+situação|2\.\s+leitura|3\.\s+classificação|4\.\s+por que|5\.\s+o que|6\.\s+pontos|7\.\s+o que não|8\.\s+checklist)/i,
  ];
  for (const line of lines) {
    if (sectionPatterns.some(p => p.test(line))) {
      lockedSections.push(line.replace(/^[ivxIVX\d]+\s*[–—-]\s*/, '').trim());
    }
    if (lockedSections.length >= 6) break;
  }

  return { titleLines, idBlock, fatosLines, lockedSections };
}

const PreviewDocumentPage: React.FC<PreviewDocumentPageProps> = ({
  serviceType,
  documentContent,
  sessionId,
  onBack,
  onPaymentConfirmed,
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const isPremium = serviceType === 'premium';
  const { titleLines, idBlock, fatosLines, lockedSections } = useMemo(
    () => parseDocument(documentContent),
    [documentContent]
  );

  const accentClass = isPremium ? 'bg-agil-green' : 'bg-agil-blue';
  const accentText  = isPremium ? 'text-agil-green' : 'text-agil-blue';
  const borderClass = isPremium ? 'border-agil-green' : 'border-agil-blue';

  return (
    <>
      <div className="min-h-screen bg-slate-100 font-sans">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={onBack} aria-label="Voltar" className="p-2 rounded-xl text-slate-400 hover:bg-slate-50">
              <ArrowLeft size={22} />
            </button>
            <img src={LOGO} alt="Agilprev" className="h-9 w-auto object-contain" />
            <div>
              <p className="font-black text-slate-800 text-sm leading-none">Seu documento está pronto</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Desbloqueie o PDF completo abaixo</p>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">

          {/* Barra de status */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle size={20} className="text-agil-green shrink-0" />
            <p className="text-green-800 font-semibold text-sm">
              {isPremium
                ? 'Documento + Análise Inteligente gerados com sucesso. Pronto para protocolo.'
                : 'Documento Previdenciário gerado com sucesso. Pronto para protocolo no INSS.'}
            </p>
          </div>

          {/* ────────── DOCUMENTO PREVIEW ────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">

            {/* Cabeçalho do documento */}
            <div className={`${accentClass} px-5 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-white" />
                <span className="text-white font-black text-sm uppercase tracking-wider">
                  {isPremium ? 'Documento + Análise Inteligente' : 'Documento Previdenciário'}
                </span>
              </div>
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Preview
              </span>
            </div>

            {/* Papel do documento */}
            <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-0 font-serif">

              {/* Título */}
              <div className="text-center mb-5">
                {titleLines.length > 0 ? (
                  titleLines.map((line, i) => (
                    <p key={i} className={`font-bold text-slate-900 leading-snug ${i === 0 ? 'text-base' : 'text-sm'}`}>
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="font-bold text-slate-900 text-base">DOCUMENTO PREVIDENCIÁRIO</p>
                )}
              </div>

              {/* Linha divisória */}
              <div className={`border-t-2 ${borderClass} mb-5`} />

              {/* Identificação do segurado */}
              {idBlock.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Identificação do Segurado</p>
                  <div className="space-y-1">
                    {idBlock.map((line, i) => (
                      <p key={i} className="text-sm text-slate-700 leading-snug">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* DOS FATOS — visível */}
              {fatosLines.length > 0 && (
                <div className="mb-0">
                  <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${accentText}`}>
                    I — DOS FATOS
                  </p>
                  {fatosLines.slice(0, 4).map((line, i) => (
                    <p key={i} className="text-sm text-slate-700 leading-relaxed mb-1">{line}</p>
                  ))}
                </div>
              )}

              {/* Fade + blur gradiente progressivo */}
              <div className="relative mt-1 pb-2">
                {/* Conteúdo desfocando gradativamente */}
                <div className="space-y-1.5 opacity-30 select-none pointer-events-none">
                  {['[continuação dos fatos relatados]', '[fundamentos legais aplicados ao seu caso]',
                    'Constituição Federal, Art. 5º, incisos XXXV e LXXVIII — direito à duração razoável...',
                    'Lei nº 9.784/1999, Art. 49 — prazo máximo de análise administrativa...',
                    'STF Tema 1066 — jurisprudência aplicada ao seu caso...'].map((line, i) => (
                    <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>
                  ))}
                </div>
                {/* Gradiente crescente */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />
              </div>
            </div>

            {/* Seções bloqueadas */}
            <div className="px-4 sm:px-6 pb-5">
              <div className="border border-dashed border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-slate-400" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Conteúdo bloqueado — {lockedSections.length + 3} seções
                  </p>
                </div>
                {[
                  { icon: '⚖️', label: 'II — Do Direito (fundamentação jurídica completa)' },
                  { icon: '📋', label: 'III — Do Pedido (itens específicos ao seu caso)' },
                  { icon: '📎', label: 'Página em Anexo — Instruções de protocolo, documentos, prazos' },
                  ...(isPremium ? [
                    { icon: '🧠', label: 'Análise Inteligente — Situação atual do seu pedido' },
                    { icon: '⚠️', label: 'Classificação de risco do caso' },
                    { icon: '🎯', label: 'Orientação: próximo passo mais seguro' },
                    { icon: '✅', label: 'Checklist estratégico + o que não fazer' },
                  ] : []),
                  ...(lockedSections.filter(s => s.length > 3).slice(0, 2).map(s => ({ icon: '📄', label: s }))),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Lock size={11} className="text-slate-300 shrink-0" />
                    <span className="text-sm text-slate-400">{item.icon} {item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ────────── CTA COMPRA ────────── */}
          <div className={`rounded-2xl border-2 ${borderClass} overflow-hidden shadow-lg`}>

            {/* Banner de urgência */}
            <div className={`${accentClass} px-5 py-3 text-center`}>
              <p className="text-white font-black text-sm">
                🔒 Seu documento está pronto. Falta apenas um passo para ter o PDF completo.
              </p>
            </div>

            <div className="bg-white p-5 space-y-4">

              {/* O que você recebe */}
              <div>
                <p className="font-black text-slate-900 text-sm mb-3">O que você recebe ao desbloquear:</p>
                <div className="grid grid-cols-1 gap-2">
                  {(isPremium ? [
                    'Documento completo pronto para protocolo no INSS',
                    'Fundamentação jurídica completa (CF/88, leis, jurisprudência)',
                    'Análise Inteligente personalizada do seu caso',
                    'Classificação de risco e orientação estratégica',
                    'Checklist e próximos passos detalhados',
                    'Guia prático de protocolo (onde, como e quando)',
                  ] : [
                    'Documento completo pronto para protocolo no INSS',
                    'Fundamentação jurídica completa (CF/88, leis, jurisprudência)',
                    'Pedidos formais específicos ao seu caso',
                    'Guia prático de protocolo (onde, como e quando)',
                    'Lista de documentos necessários',
                  ]).map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${accentClass}`}>
                        <span className="text-white text-[10px] font-black">✓</span>
                      </div>
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                      <img src={`https://i.pravatar.cc/56?u=agil${n}p`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} size={11} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">+386 documentos gerados essa semana</p>
                </div>
              </div>

              {/* Preço + botão */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Valor único via PIX</p>
                    <p className={`text-3xl font-black ${accentText}`}>{PRICES[serviceType]}</p>
                    <p className="text-xs text-slate-400">Sem mensalidade • Sem taxa de sucesso</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Liberação</p>
                    <p className="text-sm font-black text-slate-700">Instantânea</p>
                    <p className="text-xs text-slate-400">após pagamento</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPayment(true)}
                  className={`w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-sm sm:text-base transition-all active:scale-95 shadow-xl ${
                    isPremium
                      ? 'bg-agil-green hover:bg-green-600 shadow-green-500/30'
                      : 'bg-agil-blue hover:bg-blue-700 shadow-blue-500/30'
                  }`}
                >
                  <Unlock size={20} />
                  Desbloquear documento completo — {PRICES[serviceType]}
                </button>

                <div className="flex items-center justify-center gap-2">
                  <Shield size={12} className="text-slate-400" />
                  <p className="text-[11px] text-slate-400 font-semibold text-center">
                    Pagamento via PIX • 100% seguro • Liberação automática em segundos
                  </p>
                </div>
              </div>

              {/* Badge premium */}
              {isPremium && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <Zap size={16} className="text-agil-green shrink-0" />
                  <p className="text-sm text-green-800 font-semibold">
                    Inclui Análise Inteligente exclusiva — orientação personalizada sobre riscos e próximos passos do seu caso.
                  </p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {showPayment && (
        <PaymentModal
          serviceType={serviceType}
          sessionId={sessionId}
          onClose={() => setShowPayment(false)}
          onConfirmed={() => {
            setShowPayment(false);
            onPaymentConfirmed();
          }}
        />
      )}
    </>
  );
};

export default PreviewDocumentPage;
