import React, { useState, useEffect, useCallback } from 'react';
import { X, Copy, CheckCircle, Loader2, Clock, AlertCircle } from 'lucide-react';
import { createPixCharge, checkPaymentStatus } from '../lib/paymentService';

interface PaymentModalProps {
  serviceType: 'documento' | 'premium';
  sessionId: string;
  onClose: () => void;
  onConfirmed: () => void;
}

const PRICES = { documento: 'R$ 29,00', premium: 'R$ 59,00' };
const LABELS = { documento: 'Documento Previdenciário', premium: 'Documento + Análise Inteligente' };

type Step = 'loading' | 'pix' | 'confirmed' | 'error';

const PaymentModal: React.FC<PaymentModalProps> = ({ serviceType, sessionId, onClose, onConfirmed }) => {
  const [step, setStep]           = useState<Step>('loading');
  const [pixCode, setPixCode]     = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [copied, setCopied]       = useState(false);
  const [countdown, setCountdown] = useState(900);
  const [errorMsg, setErrorMsg]   = useState('');
  const isPremium = serviceType === 'premium';

  // Inicia cobrança automaticamente ao abrir
  useEffect(() => { initCharge(); }, []);

  // Countdown 15 min
  useEffect(() => {
    if (step !== 'pix') return;
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Polling de pagamento a cada 3s
  useEffect(() => {
    if (step !== 'pix') return;
    const interval = setInterval(async () => {
      const result = await checkPaymentStatus(sessionId);
      if (result.status === 'paid') {
        clearInterval(interval);
        setStep('confirmed');
        setTimeout(onConfirmed, 2000);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [step, sessionId, onConfirmed]);

  const initCharge = async () => {
    setStep('loading');
    const result = await createPixCharge(sessionId, serviceType);

    if (!result.success) {
      // Backend offline — exibe PIX de demonstração para dev/teste
      if (result.error?.includes('fetch') || result.error?.includes('network') || result.error?.includes('Failed')) {
        setPixCode('00020126580014br.gov.bcb.pix0136demo-agilprev-pix-key-para-desenvolvimento5204000053039865802BR5913AGILPREV DEMO6009SAO PAULO62140510agil-demo6304ABCD');
        setQrCodeImage('');
        setStep('pix');
        return;
      }
      setErrorMsg(result.error || 'Erro ao gerar cobrança PIX. Tente novamente.');
      setStep('error');
      return;
    }

    setPixCode(result.pixCode || '');
    setQrCodeImage(result.qrCodeImage || '');
    setStep('pix');
  };

  const copyPix = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* fallback silencioso */ }
  }, [pixCode]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col" style={{ maxHeight: '90dvh' }}>

        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between ${isPremium ? 'bg-agil-green' : 'bg-agil-blue'}`}>
          <div>
            <p className="text-white font-black text-base leading-none">{LABELS[serviceType]}</p>
            <p className="text-white/80 text-sm mt-0.5">{PRICES[serviceType]} via PIX</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-5 overflow-y-auto flex-1 min-h-0 pb-[env(safe-area-inset-bottom,20px)]">

          {/* Loading */}
          {step === 'loading' && (
            <div className="text-center py-10">
              <Loader2 size={36} className="text-agil-blue animate-spin mx-auto mb-3" />
              <p className="text-slate-600 font-semibold">Gerando seu QR Code PIX...</p>
            </div>
          )}

          {/* PIX */}
          {step === 'pix' && (
            <div className="space-y-4">

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
                <Clock size={14} className="text-amber-500" />
                <span className="text-amber-700 font-bold text-sm">Expira em {formatTime(countdown)}</span>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                {qrCodeImage ? (
                  <div className="p-3 border-2 border-slate-100 rounded-2xl bg-white">
                    <img src={qrCodeImage} alt="QR Code PIX" className="w-48 h-48" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 gap-2">
                    <p className="text-xs text-slate-400 text-center px-3 font-medium">
                      Configure o backend para exibir o QR Code
                    </p>
                  </div>
                )}
              </div>

              {/* Copia e Cola */}
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-2">PIX Copia e Cola:</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 overflow-hidden">
                    <p className="text-xs text-slate-600 font-mono truncate">{pixCode || 'Aguardando...'}</p>
                  </div>
                  <button
                    onClick={copyPix}
                    disabled={!pixCode}
                    className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${
                      copied ? 'bg-green-500 text-white' : 'bg-agil-blue text-white hover:bg-blue-700 disabled:opacity-40'
                    }`}
                  >
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Instrucoes */}
              <ol className="space-y-1.5">
                {['Abra o app do seu banco', 'Escolha pagar via PIX', 'Escaneie o QR Code ou cole o código', 'Confirme o pagamento'].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="font-black text-agil-blue shrink-0">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5">
                <div className="w-2 h-2 rounded-full bg-agil-blue animate-pulse" />
                <p className="text-xs text-blue-800 font-semibold">Aguardando confirmação do pagamento...</p>
              </div>
            </div>
          )}

          {/* Confirmado */}
          {step === 'confirmed' && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-agil-green" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Pagamento Confirmado! ✅</h3>
              <p className="text-slate-600 text-sm">Gerando seu documento completo...</p>
            </div>
          )}

          {/* Erro */}
          {step === 'error' && (
            <div className="text-center py-8">
              <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold mb-4 text-sm">{errorMsg}</p>
              <button
                onClick={initCharge}
                className="bg-agil-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm"
              >
                Tentar novamente
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
