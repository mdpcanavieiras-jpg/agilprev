import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { generateBasicDocument, generatePremiumDocument } from '../lib/generateDocument';

interface GenerateDocumentPageProps {
  serviceType: 'documento' | 'premium';
  onBack: () => void;
  onNewConsultation: () => void;
  /** Chamado assim que o documento for gerado — passa o conteúdo completo para o preview */
  onDocumentReady?: (content: string) => void;
}

const LOGO = 'https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png';

const STEPS = [
  { label: 'Lendo a conversa', threshold: 20 },
  { label: 'Aplicando base legal', threshold: 50 },
  { label: 'Redigindo o documento', threshold: 75 },
  { label: 'Revisando e finalizando', threshold: 95 },
];

const GenerateDocumentPage: React.FC<GenerateDocumentPageProps> = ({
  serviceType,
  onBack,
  onNewConsultation,
  onDocumentReady,
}) => {
  const isPremium = serviceType === 'premium';
  const [generating, setGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [document, setDocument] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generate();
  }, []);

  const tickProgress = async (target: number, durationMs: number) => {
    const steps = 10;
    const delay = durationMs / steps;
    const start = progress;
    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, delay));
      setProgress(Math.round(start + ((target - start) * i) / steps));
    }
  };

  const generate = async () => {
    try {
      const conversationRaw = localStorage.getItem('agil_conversation_data');
      const chatDocumentRaw = localStorage.getItem('agil_chat_document');

      if (!conversationRaw) {
        setError('Conversa não encontrada. Por favor, inicie um novo atendimento.');
        setGenerating(false);
        return;
      }

      const conversation = JSON.parse(conversationRaw);

      setProgress(10);
      await tickProgress(30, 800);

      let result;
      if (isPremium && chatDocumentRaw) {
        const chatDocument = JSON.parse(chatDocumentRaw);
        await tickProgress(55, 1000);
        result = await generatePremiumDocument(conversation, chatDocument);
      } else {
        await tickProgress(55, 1000);
        result = await generateBasicDocument(conversation);
      }

      await tickProgress(90, 600);

      if (!result.success || !result.content) {
        throw new Error(result.error || 'Erro ao gerar documento');
      }

      const clean = result.content
        .replace(/\[\[DOCUMENTO_PRONTO\]\]/g, '')
        .trim();

      setProgress(100);
      setDocument(clean);
      setGenerating(false);

      localStorage.setItem('agil_generated_document', JSON.stringify({
        content: clean,
        serviceType,
        timestamp: new Date().toISOString(),
      }));

      // Transição para o preview com o documento gerado
      if (onDocumentReady) {
        onDocumentReady(clean);
      }

    } catch (e) {
      setError((e as Error).message || 'Erro desconhecido.');
      setGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!document) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = margin;

    // Cabeçalho
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('AGILPREV', pageWidth / 2, y, { align: 'center' });
    y += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Assistência Previdenciária Especializada', pageWidth / 2, y, { align: 'center' });
    y += 5;

    if (isPremium) {
      doc.setFontSize(9);
      doc.setTextColor(34, 197, 94);
      doc.text('Documento + Análise Inteligente Personalizada', pageWidth / 2, y, { align: 'center' });
      y += 4;
    }

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
    y += 8;

    // Linhas separadoras
    doc.setDrawColor(isPremium ? 34 : 37, isPremium ? 197 : 99, isPremium ? 94 : 235);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y);
    y += 1;
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Corpo do documento
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const lines = doc.splitTextToSize(document, maxWidth);
    lines.forEach((line: string) => {
      if (y > pageHeight - 28) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5.5;
    });

    // Rodapé em todas as páginas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = (doc.internal as any).pages.length - 1;
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('Agilprev — contato@agilprev.com.br | (73) 99921-2498', pageWidth / 2, pageHeight - 13, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${total}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    const today = new Date();
    const fileName = `Agilprev_${isPremium ? 'Premium' : 'Documento'}_${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.pdf`;
    doc.save(fileName);
  };

  const currentStep = STEPS.findIndex(s => progress < s.threshold);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans animate-fade-in">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} aria-label="Voltar" className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
            <ArrowLeft size={22} />
          </button>
          <img src={LOGO} alt="Agilprev" className="h-9 w-auto object-contain" />
          <span className="font-black text-slate-800 text-sm">Gerando Documento</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">

          {/* Gerando */}
          {generating && (
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-agil-blue/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Loader2 size={32} className="text-agil-blue animate-spin" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">
                {isPremium ? 'Gerando Documento + Análise Inteligente' : 'Gerando seu Documento'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {STEPS[currentStep === -1 ? STEPS.length - 1 : currentStep]?.label || 'Finalizando...'}
              </p>

              {/* Barra de progresso */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isPremium ? 'bg-agil-green' : 'bg-agil-blue'}`}
                  style={{ width: `${progress}%` } as React.CSSProperties}
                />
              </div>
              <p className="text-xs text-slate-400 font-semibold">{progress}%</p>

              {/* Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`text-left p-3 rounded-xl text-xs font-semibold transition-all ${
                      progress >= step.threshold
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-slate-50 text-slate-400 border border-transparent'
                    }`}
                  >
                    {progress >= step.threshold ? '✓ ' : '○ '}{step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erro */}
          {!generating && error && (
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 text-center border border-red-100">
              <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-black text-slate-900 mb-2">Erro na Geração</h2>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <button
                onClick={onBack}
                className="bg-agil-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Voltar ao Chat
              </button>
            </div>
          )}

          {/* Sucesso */}
          {!generating && document && (
            <div className="space-y-5">

              {/* Header de sucesso */}
              <div className={`rounded-2xl p-6 text-center text-white ${isPremium ? 'bg-agil-green' : 'bg-agil-blue'}`}>
                <CheckCircle size={40} className="mx-auto mb-3 opacity-90" />
                <h1 className="text-2xl font-black mb-1">Documento Pronto!</h1>
                <p className="text-sm opacity-80">
                  {isPremium
                    ? 'Seu documento + análise inteligente estão prontos.'
                    : 'Seu documento previdenciário está pronto para protocolo.'}
                </p>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-agil-blue" />
                  <h3 className="font-black text-slate-800 text-sm">Preview do Documento</h3>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {document.substring(0, 1200)}{document.length > 1200 ? '\n...' : ''}
                  </pre>
                </div>
              </div>

              {/* Próximos passos */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                <h3 className="font-black text-blue-900 mb-3 text-sm">📋 Próximos Passos:</h3>
                <ol className="space-y-1.5 text-sm text-slate-700">
                  {[
                    'Baixe o documento clicando no botão abaixo',
                    'Imprima e assine todas as páginas',
                    'Protocole conforme as instruções no anexo do documento',
                    'Leve os documentos originais mencionados',
                    'Guarde o comprovante de protocolo',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-black text-blue-600 shrink-0">{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Botões */}
              <button
                onClick={downloadPDF}
                className={`w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-base hover:brightness-105 transition-all shadow-lg active:scale-95 ${
                  isPremium ? 'bg-agil-green shadow-green-500/25' : 'bg-agil-blue shadow-blue-500/25'
                }`}
              >
                <Download size={22} />
                Baixar Documento Completo em PDF
              </button>

              <div className="grid grid-cols-2 gap-3 min-h-[44px]">
                <button
                  onClick={onNewConsultation}
                  className="border-2 border-agil-blue text-agil-blue font-bold py-3 rounded-xl hover:bg-agil-blue hover:text-white transition-all text-sm"
                >
                  Nova Consulta
                </button>
                <button
                  onClick={onBack}
                  className="border-2 border-slate-300 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-sm"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default GenerateDocumentPage;
