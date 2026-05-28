const API_BASE = 'https://agilprev-production.up.railway.app';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function trackEvent(eventName: string, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

const GADS_CONVERSION_PREFIX = "agilprev_gads_conv_";

function trackGoogleAdsConversion(sessionId: string, serviceType: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  const storageKey = `${GADS_CONVERSION_PREFIX}${sessionId}`;
  try {
    if (localStorage.getItem(storageKey) === "1") return;
  } catch {
    /* localStorage indisponível */
  }

  const value = serviceType === "premium" ? 59 : 29;

  window.gtag("event", "conversion", {
    send_to: "AW-18171331552/CcZ7CMbwja8cEOCH4thD",
    value,
    currency: "BRL",
    transaction_id: sessionId,
  });

  try {
    localStorage.setItem(storageKey, "1");
  } catch {
    /* localStorage indisponível */
  }
}

export interface ChargeResult {
  success: boolean;
  correlationID?: string;
  pixCode?: string;
  qrCodeImage?: string;
  expiresAt?: number;
  error?: string;
}

export interface StatusResult {
  success: boolean;
  status: 'pending' | 'paid' | 'expired' | 'not_found';
}

export async function createPixCharge(
  sessionId: string,
  serviceType: 'documento' | 'premium'
): Promise<ChargeResult> {
  try {
    const res = await fetch(`${API_BASE}/api/create-charge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, serviceType }),
    });
    const data = await res.json();
    trackEvent("pix_criado", {
      produto: serviceType,
      valor: serviceType === "premium" ? 59 : 29
    });
    return data;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function checkPaymentStatus(sessionId: string): Promise<StatusResult> {
  try {
    const res = await fetch(`${API_BASE}/api/payment-status/${sessionId}`);
    const data = await res.json();
    if (data.status === "paid") {
      trackEvent("pagamento_aprovado", {
        status: "paid"
      });
      if (data.serviceType) {
        trackGoogleAdsConversion(sessionId, data.serviceType);
      }
    }
    
    return { success: true, status: data.status };
  } catch {
    return { success: false, status: 'not_found' };
  }
}

export async function saveSession(
  sessionId: string,
  serviceType: string,
  conversationData: unknown
): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, serviceType, conversationData }),
    });
  } catch (e) {
    console.warn('saveSession fallback to localStorage only', e);
  }
}
