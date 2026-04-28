import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Sparkles, User, FileText, Shield, Clock, CheckCircle, RefreshCw, Zap, Lock } from 'lucide-react';
import { sendToAgent, getOpeningMessage, Message } from '../lib/chatAgents';

interface ChatPageProps {
  serviceType: 'hero' | 'documento' | 'premium';
  onBack: () => void;
  onFinish: () => void;
}

const LOGO = 'https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png';

interface UIMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ToastItem {
  id: number;
  type: 'success' | 'error';
  title: string;
  description: string;
}

const nowTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

// ─── Painel lateral ───────────────────────────────────────────────────────────
const SidePanel: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  const accent = isPremium ? '#22c55e' : '#2563eb';
  const docs = [
    { name: 'Requerimento Administrativo', desc: 'Pedido formal ao INSS' },
    { name: 'Recurso ao CRPS',             desc: 'Contestação de indeferimento' },
    { name: 'Mandado de Segurança',        desc: 'Ação judicial urgente' },
    { name: 'Revisão Administrativa',      desc: 'Correção de valores' },
  ];
  return (
    <div className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 shrink-0">

      {/* Card identidade */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
            <img src={LOGO} alt="Agilprev" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm leading-none">Agilprev</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Assistência Previdenciária</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {['Atendimento 100% online', 'Documento em minutos', 'Fundamentação jurídica completa'].map(i => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={13} style={{ color: accent }} className="shrink-0" />
              <span className="text-xs text-slate-600 font-medium">{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card passo a passo */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Como funciona</p>
        <div className="space-y-3">
          {[
            'Responda perguntas simples',
            'IA analisa seu caso',
            'Documento gerado',
            'Você protocola no INSS',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black mt-0.5"
                style={{ background: accent }}
              >
                {i + 1}
              </div>
              <span className="text-[12.5px] text-slate-600 font-medium leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card documentos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={13} style={{ color: accent }} />
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Documentos disponíveis</p>
        </div>
        <div className="space-y-2">
          {docs.map(d => (
            <div key={d.name} className="rounded-lg px-3 py-2" style={{ background: '#f8fafc' }}>
              <p className="text-[11.5px] font-black text-slate-700 leading-none">{d.name}</p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Segurança */}
      <div className="flex items-center gap-2 px-1">
        <Lock size={11} className="text-slate-300 shrink-0" />
        <p className="text-[10.5px] text-slate-300 font-semibold">Conversa segura e criptografada</p>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const ChatPage: React.FC<ChatPageProps> = ({ serviceType, onBack, onFinish }) => {
  const isPremium = serviceType === 'premium';
  const accent    = isPremium ? '#22c55e' : '#2563eb';
  const accentDark = isPremium ? '#16a34a' : '#1d4ed8';

  const [messages, setMessages]         = useState<UIMessage[]>([
    { id: 1, role: 'assistant', content: getOpeningMessage(serviceType), time: nowTime() },
  ]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[] | null>(null);
  const [toasts, setToasts]             = useState<ToastItem[]>([]);
  const [isUnresponsive, setIsUnresponsive] = useState(false);
  const [lastSentAt, setLastSentAt]     = useState<number | null>(null);
  const [lastFailedMessages, setLastFailedMessages] = useState<Message[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages, loading]);
  useEffect(() => { if (!loading && !documentReady) inputRef.current?.focus(); }, [loading, documentReady]);

  // Contexto do MiniChat "Outro"
  useEffect(() => {
    const ctx = localStorage.getItem('agil_initial_context');
    if (ctx) { localStorage.removeItem('agil_initial_context'); setTimeout(() => handleSend(ctx), 600); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detectar timeout (30s)
  useEffect(() => {
    if (!loading || !lastSentAt) return;
    const t = setTimeout(() => setIsUnresponsive(true), 30000);
    return () => clearTimeout(t);
  }, [loading, lastSentAt]);

  useEffect(() => { if (!loading) setIsUnresponsive(false); }, [loading]);

  // Toast
  const addToast = (type: 'success' | 'error', title: string, description: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, title, description }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  };

  // Reativação
  const REACTIVATION = ['oi', 'olá', 'ola', 'hello', 'hi', 'opa'];
  const isReactivation = (t: string) => REACTIVATION.includes(t.toLowerCase().trim());

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || documentReady) return;
    if (isUnresponsive && isReactivation(text)) { setIsUnresponsive(false); setLastSentAt(null); setLoading(false); }
    if (loading) return;

    const userMsg: UIMessage = { id: messages.length + 1, role: 'user', content: text, time: nowTime() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setQuickReplies(null);
    setLoading(true);
    setLastSentAt(Date.now());

    const history = updated.map(m => ({ role: m.role, content: m.content }));
    localStorage.setItem('agil_conversation_data', JSON.stringify(history));

    await new Promise(r => setTimeout(r, 800));

    const apiHistory: Message[] = updated.map(m => ({ role: m.role, content: m.content }));
    setLastFailedMessages(apiHistory);
    const result = await sendToAgent(apiHistory, serviceType);

    // Detectar botões [[...]]
    const quickMatches = result.message?.match(/\[\[.*?\]\]|\[\s*.*?\s*\]/g);

    if (quickMatches) {
      const options = quickMatches
        .map(opt => opt.replace(/\[|\]/g, '').trim())
        .filter(opt =>
          opt === 'Gerar Documento' ||
          opt === 'Documento + Análise Inteligente'
        );
    
      if (options.length > 0) {
        setQuickReplies(options);
      }
    }

    setLoading(false);
    setLastSentAt(null);

    if (!result.success) {
      addToast('error', 'Erro de conexão', result.error || 'Não foi possível conectar. Tente novamente.');
      return;
    }
    setLastFailedMessages(null);

    const botMsg: UIMessage = { id: updated.length + 1, role: 'assistant', content: result.message
      ?.replace(/\[\[Gerar Documento\]\]|\[\s*Gerar Documento\s*\]/g, '')
      ?.replace(/\[\[Documento \+ Análise Inteligente\]\]|\[\s*Documento \+ Análise Inteligente\s*\]/g, '')
      ?.trim(), time: nowTime() };
    const all = [...updated, botMsg];
    setMessages(all);
    localStorage.setItem('agil_conversation_data', JSON.stringify(all.map(m => ({ role: m.role, content: m.content }))));

    // if (result.quickReplies?.length && !result.documentReady) setQuickReplies(result.quickReplies);
    if (result.documentReady) {
      localStorage.setItem('agil_chat_document', JSON.stringify(result.message));
      localStorage.setItem('agil_service_type', serviceType);
      setDocumentReady(true);
      addToast('success', '✅ Análise concluída!', 'Gerando seu documento...');
      setTimeout(onFinish, 2000);
    }
  };

  const handleRetry = async () => {
    if (!lastFailedMessages) return;
    setLoading(true); setIsUnresponsive(false); setLastSentAt(Date.now());
    await new Promise(r => setTimeout(r, 800));
    const result = await sendToAgent(lastFailedMessages, serviceType);
    setLoading(false); setLastSentAt(null);
    if (!result.success) { addToast('error', 'Erro', result.error || 'Tente novamente.'); return; }
    setLastFailedMessages(null);
    const botMsg: UIMessage = { id: messages.length + 2, role: 'assistant', content: result.message, time: nowTime() };
    setMessages(p => [...p, botMsg]);
    if (result.quickReplies?.length && !result.documentReady) setQuickReplies(result.quickReplies);
    if (result.documentReady) {
      localStorage.setItem('agil_chat_document', JSON.stringify(result.message));
      setDocumentReady(true);
      addToast('success', '✅ Análise concluída!', 'Gerando seu documento...');
      setTimeout(onFinish, 2000);
    }
  };

  const handleQuickReply = (option: string) => {
    setQuickReplies(null);
  
    if (option === 'Gerar Documento') {
      handleSend('Quero gerar o documento previdenciário.');
      return;
    }
  
    if (option === 'Documento + Análise Inteligente') {
      handleSend('Quero seguir com Documento + Análise Inteligente.');
      return;
    }
  
    handleSend(option);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh', background: '#f1f5f9' }}>

      {/* Toasts */}
      <div className="fixed top-4 right-2 sm:right-4 z-[999] space-y-2 w-[calc(100vw-1rem)] sm:w-72 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-xl px-4 py-3 shadow-xl text-white animate-fade-in pointer-events-auto ${t.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <p className="font-black text-sm leading-none">{t.title}</p>
            <p className="text-[12px] opacity-90 mt-1">{t.description}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
                <img src={LOGO} alt="Agilprev" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-[15px] leading-none">Agilprev</span>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                    style={{ background: accent }}
                  >
                    {isPremium ? 'Premium' : 'Documento'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {isPremium ? 'Agente Daniel — Online' : 'Assistente Inteligente — Online'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock size={12} />
            <span className="text-[11px] font-semibold hidden sm:block">Conversa segura</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 flex gap-5 items-start">

        <SidePanel isPremium={isPremium} />

        {/* Chat */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" style={{ height: 'calc(100dvh - 130px)' }}>

          {/* Aviso mobile */}
          <div className="lg:hidden px-4 py-2.5 border-b border-slate-100 flex items-center gap-2" style={{ background: '#f8fafc' }}>
            <Zap size={13} style={{ color: accent }} className="shrink-0" />
            <p className="text-[12px] text-slate-500 font-semibold">
              Responda as perguntas e receba seu documento pronto ✅
            </p>
            {isUnresponsive && (
              <span className="ml-auto text-[11px] text-orange-500 font-bold shrink-0">⏱ Sem resposta</span>
            )}
          </div>

          {/* Mensagens */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img src={LOGO} alt="" className="w-6 h-6 object-contain" />
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[78%] sm:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed font-medium whitespace-pre-wrap break-words shadow-sm ${
                      msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                    }`}
                    style={msg.role === 'user' ? { background: accent } : {}}
                  >
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] text-slate-300 font-semibold px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Clock size={9} />
                    {msg.time}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm" style={{ background: accent }}>
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                  <img src={LOGO} alt="" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                  {[0, 150, 300].map(delay => (
                    <div
                      key={delay}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: accent, animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Timeout + retry */}
            {isUnresponsive && !documentReady && (
              <div className="flex justify-center animate-fade-in">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 text-center max-w-sm">
                  <p className="text-amber-800 font-black text-sm mb-0.5">⏱️ Sem resposta do assistente</p>
                  <p className="text-amber-600 text-xs mb-3">Pode ser instabilidade temporária na conexão.</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 bg-amber-500 text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-amber-600 transition-all active:scale-95"
                    >
                      <RefreshCw size={12} /> Tentar novamente
                    </button>
                    <button
                      onClick={() => { setIsUnresponsive(false); setLoading(false); }}
                      className="text-amber-700 text-xs font-semibold px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-50 transition-all"
                    >
                      Ignorar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Documento pronto — aguardando redirect */}
            {documentReady && (
              <div className="flex justify-center animate-fade-in">
                <div className="rounded-xl px-6 py-4 text-center border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <Sparkles size={20} className="mx-auto mb-2" style={{ color: '#22c55e' }} />
                  <p className="font-black text-sm" style={{ color: '#15803d' }}>Análise concluída!</p>
                  <p className="text-xs mt-1" style={{ color: '#166534' }}>Gerando seu documento profissional...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {quickReplies && quickReplies.length > 0 && !documentReady && (
            <div className="border-t border-slate-100 px-4 sm:px-6 pt-3 pb-3" style={{ background: '#f8fafc' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Toque para selecionar:
                </p>
              </div>
              {/* Grid adaptativo: 2 colunas se itens curtos, 1 coluna se longos */}
              <div
                className="grid gap-1.5 max-h-48 overflow-y-auto pr-0.5"
                style={{
                  gridTemplateColumns: quickReplies.every(o => o.length <= 22)
                    ? 'repeat(2, 1fr)'
                    : '1fr',
                }}
              >
                {quickReplies && quickReplies.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(opt)}
                    disabled={loading}
                    className="group relative text-left px-3.5 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 select-none"
                    style={{
                      borderColor: `${accent}35`,
                      color: accent,
                      background: 'white',
                    }}
                    onMouseEnter={e => {
                      const btn = e.currentTarget as HTMLElement;
                      btn.style.background = accent;
                      btn.style.color = '#fff';
                      btn.style.borderColor = accent;
                    }}
                    onMouseLeave={e => {
                      const btn = e.currentTarget as HTMLElement;
                      btn.style.background = 'white';
                      btn.style.color = accent;
                      btn.style.borderColor = `${accent}35`;
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                        style={{ borderColor: `${accent}60` }}
                      />
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          {!documentReady && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-white">
              <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Digite sua resposta..."
                  disabled={loading}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13.5px] text-slate-700 font-medium focus:outline-none focus:bg-white transition-all disabled:opacity-50"
                  style={{ ['--tw-ring-color' as string]: accent }}
                  onFocus={e => { e.currentTarget.style.borderColor = accent; }}
                  onBlur={e => { e.currentTarget.style.borderColor = ''; }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-all active:scale-95 disabled:opacity-40 shrink-0"
                  style={{ background: loading ? '#94a3b8' : accent }}
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                </button>
              </form>
              <p className="text-center text-[10px] text-slate-300 font-semibold mt-2 uppercase tracking-wider flex items-center justify-center gap-1">
                <Lock size={9} /> Dados usados apenas para gerar seu documento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
