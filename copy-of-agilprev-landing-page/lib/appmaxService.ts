/**
 * AppMax — Gateway de pagamento (portado do original Agilprev)
 * Versão básica: redireciona para o link de checkout AppMax
 * Na volta, a URL contém ?payment=success
 */

// Links de checkout AppMax (configurar nos .env.local se necessário)
const APPMAX_URL_DOCUMENTO =
  import.meta.env.VITE_APPMAX_URL_DOCUMENTO || 'https://pay.finaliza.shop/pl/42c9ac4dc0';

const APPMAX_URL_PREMIUM =
  import.meta.env.VITE_APPMAX_URL_PREMIUM || 'https://pay.finaliza.shop/pl/42c9ac4dc0';

// ─────────────────────────────────────────────────────────────────────
// Extrai dados do cliente da conversa do chat
// ─────────────────────────────────────────────────────────────────────
export interface CustomerData {
  name: string;
  cpf: string;
  email: string;
  rg: string;
  address: string;
}

/** Valida CPF pelos dígitos verificadores (portado do original) */
export function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  if (rem !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  return rem === parseInt(cpf[10]);
}

export function extractCustomerData(
  conversationData: Array<{ role: string; content: string }>
): CustomerData {
  let name = '';
  let cpf = '';
  let email = '';
  let rg = '';
  let address = '';

  if (!conversationData || !Array.isArray(conversationData)) {
    return getDefaultCustomerData();
  }

  for (const msg of conversationData) {
    if (msg.role !== 'user' || !msg.content) continue;
    const content = msg.content.trim();

    // Nome: primeira resposta sem números longos nem marcadores
    if (!name && content.length > 5 && content.length < 100 && !content.includes('|') && !content.includes('[')) {
      const words = content.split(' ');
      const hasCPF = words.some(w => /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/.test(w));
      if (words.length >= 2 && words.length <= 6 && !hasCPF) {
        name = content;
      }
    }

    // CPF — extrai e valida dígitos verificadores
    const cpfMatch = content.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/);
    if (cpfMatch && !cpf) {
      const extracted = cpfMatch[0].replace(/\D/g, '');
      if (isValidCPF(extracted)) cpf = extracted;
    }

    // RG — captura RG, R.G., rg, r.g. (portado do original)
    const rgMatch = content.match(/(?:RG|R\.G\.|rg|r\.g\.)[\s:]*([0-9.\-]+)/i);
    if (rgMatch && !rg) rg = rgMatch[1].replace(/\D/g, '');

    // Email
    const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !email) email = emailMatch[0];

    // Endereço (detectar pelo CEP)
    const cepMatch = content.match(/\d{5}-?\d{3}/);
    if (cepMatch && !address) address = content;
  }

  return {
    name: name || 'Cliente',
    cpf: cpf || '',
    email: email || '',
    rg: rg || '',
    address: address || '',
  };
}

function getDefaultCustomerData(): CustomerData {
  return { name: 'Cliente', cpf: '', email: '', rg: '', address: '' };
}

// ─────────────────────────────────────────────────────────────────────
// Redireciona para o checkout AppMax (versão básica — mais simples e confiável)
// ─────────────────────────────────────────────────────────────────────
export function redirectToAppMaxPayment(
  serviceType: 'documento' | 'premium',
  customerData?: CustomerData
) {
  const baseUrl = serviceType === 'premium' ? APPMAX_URL_PREMIUM : APPMAX_URL_DOCUMENTO;
  const returnUrl = `${window.location.origin}${window.location.pathname}?payment=success&service=${serviceType}`;

  // Salvar estado para recuperar depois do retorno
  localStorage.setItem('agil_payment_pending', JSON.stringify({
    serviceType,
    customerData,
    timestamp: new Date().toISOString(),
    returnUrl,
  }));

  const paymentUrl = `${baseUrl}?return_url=${encodeURIComponent(returnUrl)}`;
  window.location.href = paymentUrl;
}

// ─────────────────────────────────────────────────────────────────────
// Verificar se voltou de um pagamento bem-sucedido
// ─────────────────────────────────────────────────────────────────────
export function checkPaymentReturn(): {
  success: boolean;
  serviceType: 'documento' | 'premium' | null;
} {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('payment') === 'success';
  const service = params.get('service') as 'documento' | 'premium' | null;

  if (success) {
    // Limpar da URL sem recarregar
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }

  return { success, serviceType: service };
}
