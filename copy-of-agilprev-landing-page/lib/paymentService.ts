const API_BASE = 'https://agilprev-production.up.railway.app';

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
    return data;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function checkPaymentStatus(sessionId: string): Promise<StatusResult> {
  try {
    const res = await fetch(`${API_BASE}/api/payment-status/${sessionId}`);
    const data = await res.json();
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
