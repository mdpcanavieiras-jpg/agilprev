import React, { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import Header from './components/Header';
import Hero from './components/Hero';
import MiniChat from './components/MiniChat';
import VideoExplanation from './components/VideoExplanation';
import Stats from './components/Stats';
import Solutions from './components/Solutions';
import Benefits from './components/Benefits';
import DocumentPreview from './components/DocumentPreview';
import PricingSelection from './components/PricingSelection';
import HowWeHelp from './components/HowWeHelp';
import WorkflowSteps from './components/WorkflowSteps';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import LearnMore from './components/LearnMore';
import Footer from './components/Footer';
import SelectionModal from './components/SelectionModal';
import ChatPage from './components/ChatPage';
import GenerateDocumentPage from './components/GenerateDocumentPage';
import PreviewDocumentPage from './components/PreviewDocumentPage';

// ──────────────────────────────────────────────────────────────────────
// FLUXO CORRETO:
// landing → chat → generating → preview (paywall) → pagamento → download
// ──────────────────────────────────────────────────────────────────────
type View = 'landing' | 'chat' | 'generating' | 'preview' | 'done';

const App: React.FC = () => {
  const [currentView, setCurrentView]     = useState<View>('landing');
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [selectedService, setSelectedService] = useState<'hero' | 'documento' | 'premium'>('hero');
  const [generatedDoc, setGeneratedDoc]   = useState<string>('');


  const [sessionId] = useState<string>(() => {
    const saved = localStorage.getItem('agil_session_id');
    if (saved) return saved;
    const id = uuidv4();
    localStorage.setItem('agil_session_id', id);
    return id;
  });

  // ── Navegação ──────────────────────────────────────────────────
  const openModal  = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const startChat = (type: 'documento' | 'premium') => {
    setSelectedService(type);
    setIsModalOpen(false);
    setGeneratedDoc('');
    localStorage.removeItem('agil_conversation_data');
    localStorage.removeItem('agil_chat_document');
    localStorage.removeItem('agil_generated_document');
    window.scrollTo(0, 0);
    setCurrentView('chat');
  };

  // Chat terminou → ir para página de geração (com loading real)
  const goToGenerating = () => {
    window.scrollTo(0, 0);
    setCurrentView('generating');
  };

  // Documento gerado → ir para preview com conteúdo real
  const onDocumentReady = useCallback((content: string) => {
    setGeneratedDoc(content);
    window.scrollTo(0, 0);
    setCurrentView('preview');
  }, []);

  // Pagamento confirmado → baixar PDF + ir para tela de conclusão
  const downloadAndFinish = useCallback(() => {
    if (!generatedDoc) return;
    buildAndDownloadPDF(generatedDoc, selectedService);
    window.scrollTo(0, 0);
    setCurrentView('done');
  }, [generatedDoc, selectedService]);

  // Enviar e-mail com o documento via backend (Resend)
  const sendDocumentByEmail = useCallback(async (email: string, customerName?: string) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';
    try {
      const res = await fetch(`${API_BASE}/api/send-document-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          customerName: customerName || '',
          serviceType: selectedService,
          documentContent: generatedDoc,
          sessionId,
        }),
      });
      const data = await res.json();
      return data.success as boolean;
    } catch {
      return false;
    }
  }, [generatedDoc, selectedService, sessionId]);

  const goToLanding = () => {
    const newId = uuidv4();
    localStorage.setItem('agil_session_id', newId);
    localStorage.removeItem('agil_conversation_data');
    localStorage.removeItem('agil_chat_document');
    localStorage.removeItem('agil_generated_document');
    setGeneratedDoc('');
    window.scrollTo(0, 0);
    setCurrentView('landing');
  };

  // ── Reveal animation ──────────────────────────────────────────
  useEffect(() => {
    if (currentView !== 'landing') return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [currentView]);

  // ── Views ─────────────────────────────────────────────────────
  if (currentView === 'chat') {
    return (
      <ChatPage
        serviceType={selectedService}
        onBack={goToLanding}
        onFinish={goToGenerating}   // ← agora vai gerar antes do preview
      />
    );
  }
  return (
    <>
      {currentView === 'landing' && (
        <>
      <Hero
  onOpenModal={() => {}}
  onStartChat={(type) => {
    setSelectedService(type);
    setCurrentView('chat');
  }}
/>
  
        </>
      )}
    </>
  );

  // Geração do documento (loading + chamada real à OpenAI)
  if (currentView === 'generating') {
    return (
      <GenerateDocumentPage
        serviceType={selectedService}
        onBack={() => setCurrentView('chat')}
        onNewConsultation={goToLanding}
        onDocumentReady={onDocumentReady}   // ← transição automática para preview
      />
    );
  }

  // ── Tela de conclusão após download ──────────────────────────
  if (currentView === 'done') {
    return (
      <DonePage
        serviceType={selectedService}
        generatedDoc={generatedDoc}
        onNewConsultation={goToLanding}
        onDownloadAgain={() => buildAndDownloadPDF(generatedDoc, selectedService)}
        onSendEmail={sendDocumentByEmail}
      />
    );
  }

  // Preview parcial + paywall → pagamento → download
  if (currentView === 'preview') {
    return (
      <PreviewDocumentPage
        serviceType={selectedService}
        documentContent={generatedDoc}
        sessionId={sessionId}
        onBack={() => setCurrentView('generating')}
        onPaymentConfirmed={downloadAndFinish}  // ← baixa o PDF já gerado
      />
    );
  }

  // ── Landing ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenModal={openModal} />
      <main className="flex-grow">
        <Hero onOpenModal={openModal} onStartChat={startChat} />
        <div className="reveal"><VideoExplanation /></div>
        <div className="reveal"><Stats /></div>
        <div className="reveal"><Solutions /></div>
        <div className="reveal"><Benefits /></div>
        <div className="reveal"><DocumentPreview /></div>
        <div className="reveal"><PricingSelection onSelect={startChat} /></div>
        <div className="reveal"><HowWeHelp /></div>
        <div className="reveal"><WorkflowSteps /></div>
        <div className="reveal"><FAQ /></div>
        <div className="reveal"><Testimonials /></div>
        <div className="reveal"><LearnMore /></div>
      </main>
      <Footer />
      <SelectionModal isOpen={isModalOpen} onClose={closeModal} onSelect={startChat} />
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────
// Tela de conclusão após download do PDF
// ──────────────────────────────────────────────────────────────────────
const LOGO_URL = 'https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png';

interface DonePageProps {
  serviceType: 'documento' | 'premium';
  generatedDoc: string;
  onNewConsultation: () => void;
  onDownloadAgain: () => void;
  onSendEmail: (email: string, name?: string) => Promise<boolean>;
}

const DonePage: React.FC<DonePageProps> = ({ serviceType, onNewConsultation, onDownloadAgain, onSendEmail }) => {
  const isPremium = serviceType === 'premium';
  const accentBg = isPremium ? 'bg-agil-green' : 'bg-agil-blue';
  const [email, setEmail] = React.useState('');
  const [emailStatus, setEmailStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSendEmail = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setEmailStatus('sending');
    const ok = await onSendEmail(email.trim());
    setEmailStatus(ok ? 'sent' : 'error');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-5">

        {/* Sucesso */}
        <div className={`${accentBg} rounded-3xl p-8 text-center text-white shadow-2xl`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-black mb-2">Documento Baixado!</h1>
          <p className="text-white/90 text-sm">
            {isPremium
              ? 'Seu Documento + Análise Inteligente foi baixado com sucesso.'
              : 'Seu Documento Previdenciário foi baixado com sucesso.'}
          </p>
          <p className="text-white/70 text-xs mt-2">Verifique sua pasta de Downloads.</p>
        </div>

        {/* Envio por e-mail */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-slate-800 text-sm mb-3">📧 Receber também por e-mail:</p>
          {emailStatus === 'sent' ? (
            <p className="text-agil-green font-bold text-sm">✅ E-mail enviado com sucesso!</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-agil-blue"
                disabled={emailStatus === 'sending'}
              />
              <button
                onClick={handleSendEmail}
                disabled={!email.trim() || emailStatus === 'sending'}
                className={`w-full sm:w-auto px-4 py-2.5 text-white font-bold text-sm rounded-xl disabled:opacity-40 transition-all ${accentBg}`}
              >
                {emailStatus === 'sending' ? '...' : 'Enviar'}
              </button>
            </div>
          )}
          {emailStatus === 'error' && (
            <p className="text-red-500 text-xs mt-1">Falha no envio. Tente novamente ou baixe o PDF.</p>
          )}
        </div>

        {/* Próximos passos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-slate-800 mb-4 text-sm">📋 Próximos passos:</h3>
          <ol className="space-y-2">
            {[
              'Abra o PDF baixado e leia com atenção',
              'Imprima o documento e assine todas as páginas',
              'Siga as instruções da PÁGINA EM ANEXO dentro do documento',
              'Leve os documentos originais indicados no protocolo',
              'Guarde o comprovante de protocolo como prova',
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                <span className={`font-black shrink-0 ${isPremium ? 'text-agil-green' : 'text-agil-blue'}`}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Suporte */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">📞</span>
          <div>
            <p className="font-bold text-blue-900 text-sm">Dúvidas sobre o INSS?</p>
            <p className="text-blue-700 text-xs mt-0.5">
              Ligue <strong>135</strong> (INSS) ou fale conosco em <strong>contato@agilprev.com.br</strong> | (73) 99921-2498
            </p>
          </div>
        </div>

        <button
          onClick={onDownloadAgain}
          className={`w-full text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-base transition-all active:scale-95 ${accentBg} hover:brightness-105 shadow-lg`}
        >
          ⬇️ Baixar novamente
        </button>

        <button
          onClick={onNewConsultation}
          className="w-full border-2 border-slate-300 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-sm"
        >
          Iniciar nova consulta
        </button>

        <div className="flex justify-center pt-2">
          <img src={LOGO_URL} alt="Agilprev" className="h-12 w-auto object-contain opacity-60" />
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────
// Gera e baixa o PDF a partir do conteúdo já pronto
// ──────────────────────────────────────────────────────────────────────
function buildAndDownloadPDF(content: string, serviceType: 'documento' | 'premium') {
  const isPremium = serviceType === 'premium';
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw   = doc.internal.pageSize.getWidth();
  const ph   = doc.internal.pageSize.getHeight();
  const m    = 20;
  let y      = m;

  // Cabeçalho
  doc.setFontSize(22); doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('AGILPREV', pw / 2, y, { align: 'center' }); y += 7;

  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Assistência Previdenciária Especializada', pw / 2, y, { align: 'center' }); y += 5;

  if (isPremium) {
    doc.setFontSize(9); doc.setTextColor(34, 197, 94);
    doc.text('Documento + Análise Inteligente Personalizada', pw / 2, y, { align: 'center' }); y += 4;
  }

  doc.setFontSize(8); doc.setTextColor(150, 150, 150);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, pw / 2, y, { align: 'center' }); y += 8;

  // Separador
  const r = isPremium ? 34 : 37, g = isPremium ? 197 : 99, b = isPremium ? 94 : 235;
  doc.setDrawColor(r, g, b); doc.setLineWidth(0.6);
  doc.line(m, y, pw - m, y); y += 1; doc.line(m, y, pw - m, y); y += 12;

  // Corpo
  doc.setFontSize(10.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0);
  const lines = doc.splitTextToSize(content, pw - 2 * m);
  (lines as string[]).forEach(line => {
    if (y > ph - 28) { doc.addPage(); y = m; }
    doc.text(line, m, y); y += 5.5;
  });

  // Rodapé
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = (doc.internal as any).pages.length - 1;
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3);
    doc.line(m, ph - 18, pw - m, ph - 18);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'italic'); doc.setTextColor(120, 120, 120);
    doc.text('Agilprev — contato@agilprev.com.br | (73) 99921-2498', pw / 2, ph - 13, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Página ${i} de ${total}`, pw / 2, ph - 8, { align: 'center' });
  }

  const today = new Date();
  doc.save(`Agilprev_${isPremium ? 'Premium' : 'Documento'}_${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.pdf`);
}

export default App;
